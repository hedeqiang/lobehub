import { createDiscordAdapter } from '@chat-adapter/discord';
import { createRedisState } from '@chat-adapter/state-redis';
import { Chat } from 'chat';
import debug from 'debug';

import { getServerDB } from '@/database/core/db-adaptor';

import { AgentBridgeService } from './AgentBridgeService';

const log = debug('lobe-server:bot:provider-manager');

interface ResolvedAgentInfo {
  agentId: string;
  userId: string;
}

/**
 * Manages Chat SDK Bot instances, maps incoming webhook requests to the
 * correct agent, and wires up the platform-agnostic AgentBridgeService.
 *
 * Supports per-agent configuration (stored in agent.agencyConfig) with
 * environment-variable fallback for simple single-bot deployments.
 */
export class BotProviderManager {
  private bridge = new AgentBridgeService();

  /** Discord applicationId → { agentId, userId } */
  private discordAgentMap = new Map<string, ResolvedAgentInfo>();

  /** Cached Chat instances keyed by a unique config fingerprint */
  private botInstances = new Map<string, Chat<any>>();

  /** Fallback Chat instance created from environment variables */
  private fallbackBot: Chat<any> | null = null;

  // ------------------------------------------------------------------
  // Public API
  // ------------------------------------------------------------------

  /**
   * Get the webhook handler for a given platform.
   * Returns a function compatible with Next.js Route Handler: `(req: Request) => Promise<Response>`
   */
  getWebhookHandler(platform: string): (req: Request) => Promise<Response> {
    return async (req: Request) => {
      // Ensure initialisation has happened
      await this.ensureInitialized();

      if (platform === 'discord') {
        // Try per-agent bots first, then fallback
        // For Discord, all bots share the same webhook endpoint — the Chat SDK
        // internally routes based on the applicationId in the interaction payload.
        // We iterate registered bots and try each one (first match wins).
        for (const bot of this.botInstances.values()) {
          if (bot.webhooks && 'discord' in bot.webhooks) {
            return bot.webhooks.discord(req);
          }
        }
        if (this.fallbackBot?.webhooks && 'discord' in this.fallbackBot.webhooks) {
          return this.fallbackBot.webhooks.discord(req);
        }
      }

      return new Response('No bot configured for this platform', { status: 404 });
    };
  }

  // ------------------------------------------------------------------
  // Initialisation
  // ------------------------------------------------------------------

  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    await this.initialize();
    this.initialized = true;
  }

  /**
   * Scan all agents with agencyConfig and create Chat SDK instances.
   * Also creates a fallback instance from environment variables.
   */
  async initialize(): Promise<void> {
    log('Initializing BotProviderManager');

    // 1. Create fallback bot from environment variables
    this.createFallbackBot();

    // 2. Scan agents with agencyConfig and create per-agent bots
    await this.loadAgentBots();

    log(
      'Initialized: %d agent bots, fallback=%s',
      this.botInstances.size,
      this.fallbackBot ? 'yes' : 'no',
    );
  }

  // ------------------------------------------------------------------
  // Fallback bot (env-var based)
  // ------------------------------------------------------------------

  private createFallbackBot(): void {
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;
    const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
    const DISCORD_DEFAULT_AGENT_ID = process.env.DISCORD_DEFAULT_AGENT_ID;
    const DISCORD_DEFAULT_USER_ID = process.env.DISCORD_DEFAULT_USER_ID;

    if (!DISCORD_BOT_TOKEN || !DISCORD_PUBLIC_KEY) {
      log('No Discord env vars configured, skipping fallback bot');
      return;
    }

    if (!DISCORD_DEFAULT_AGENT_ID || !DISCORD_DEFAULT_USER_ID) {
      log('DISCORD_DEFAULT_AGENT_ID or DISCORD_DEFAULT_USER_ID not set, skipping fallback bot');
      return;
    }

    const adapters: Record<string, any> = {
      discord: createDiscordAdapter({
        botToken: DISCORD_BOT_TOKEN,
        publicKey: DISCORD_PUBLIC_KEY,
      }),
    };

    const bot = this.createBot(adapters, 'fallback');
    this.registerHandlers(bot, {
      agentId: DISCORD_DEFAULT_AGENT_ID,
      userId: DISCORD_DEFAULT_USER_ID,
    });
    this.fallbackBot = bot;

    if (DISCORD_APPLICATION_ID) {
      this.discordAgentMap.set(DISCORD_APPLICATION_ID, {
        agentId: DISCORD_DEFAULT_AGENT_ID,
        userId: DISCORD_DEFAULT_USER_ID,
      });
    }

    log('Created fallback Discord bot (agent=%s)', DISCORD_DEFAULT_AGENT_ID);
  }

  // ------------------------------------------------------------------
  // Per-agent bots
  // ------------------------------------------------------------------

  private async loadAgentBots(): Promise<void> {
    try {
      const serverDB = await getServerDB();

      // Query all agents that have agencyConfig set.
      // We use a raw-ish approach because AgentModel is user-scoped.
      // For now, iterate known agents — a production implementation would
      // use a dedicated query that filters by agencyConfig IS NOT NULL.
      // TODO: add a dedicated model method for querying agents by agencyConfig
      log('Loading per-agent bot configurations (not yet implemented — using fallback only)');
    } catch (error) {
      log('Failed to load agent bots: %O', error);
    }
  }

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  private createBot(adapters: Record<string, any>, label: string): Chat<any> {
    const config: any = {
      adapters,
      userName: `lobechat-bot-${label}`,
    };

    if (process.env.REDIS_URL) {
      config.state = createRedisState({ url: process.env.REDIS_URL });
    }

    return new Chat(config);
  }

  private registerHandlers(bot: Chat<any>, info: ResolvedAgentInfo): void {
    const { agentId, userId } = info;

    bot.onNewMention(async (thread, message) => {
      log('onNewMention: agent=%s, author=%s', agentId, message.author.userName);
      await this.bridge.handleMention(thread, message, { agentId, userId });
    });

    bot.onSubscribedMessage(async (thread, message) => {
      // Skip messages from bots to avoid loops
      if (message.author.isBot === true) return;

      log('onSubscribedMessage: agent=%s, author=%s', agentId, message.author.userName);

      // TODO: resolve topicId from thread state mapping (LOBE-5312)
      // For now, create a new topic each time (single-turn within subscribed threads)
      await this.bridge.handleSubscribedMessage(thread, message, {
        agentId,
        topicId: '', // empty = bridge will create new topic via execAgent
        userId,
      });
    });
  }
}

// ------------------------------------------------------------------
// Singleton
// ------------------------------------------------------------------

let instance: BotProviderManager | null = null;

export function getBotProviderManager(): BotProviderManager {
  if (!instance) {
    instance = new BotProviderManager();
  }
  return instance;
}
