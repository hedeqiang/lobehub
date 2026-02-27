import debug from 'debug';

import { getServerDB } from '@/database/core/db-adaptor';
import { AgentBotProviderModel } from '@/database/models/agentBotProvider';
import { KeyVaultsGateKeeper } from '@/server/modules/KeyVaultsEncrypt';

import { DiscordBot } from './DiscordBot';
import type { PlatformBot } from './types';

const log = debug('lobe-server:bot:gateway');

export interface GatewayManagerConfig {
  syncIntervalMs?: number;
  webhookUrl: string;
}

export class GatewayManager {
  private bots = new Map<string, PlatformBot>();
  private running = false;
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private config: GatewayManagerConfig;

  constructor(config: GatewayManagerConfig) {
    this.config = config;
  }

  get isRunning(): boolean {
    return this.running;
  }

  // ------------------------------------------------------------------
  // Lifecycle (call once)
  // ------------------------------------------------------------------

  async start(): Promise<void> {
    if (this.running) {
      log('GatewayManager already running, skipping');
      return;
    }

    log('Starting GatewayManager, webhookUrl=%s', this.config.webhookUrl);

    await this.sync().catch((err) => {
      log('Initial sync failed (will retry): %O', err);
    });

    const intervalMs = this.config.syncIntervalMs ?? 300_000;
    this.syncInterval = setInterval(() => {
      this.sync().catch((err) => {
        log('Periodic sync failed: %O', err);
      });
    }, intervalMs);

    this.running = true;
    log('GatewayManager started with %d bots', this.bots.size);
  }

  async stop(): Promise<void> {
    if (!this.running) return;

    log('Stopping GatewayManager');

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    for (const [key, bot] of this.bots) {
      log('Stopping bot %s', key);
      await bot.stop();
    }
    this.bots.clear();

    this.running = false;
    log('GatewayManager stopped');
  }

  // ------------------------------------------------------------------
  // Bot operations (point-to-point)
  // ------------------------------------------------------------------

  async startBot(platform: string, applicationId: string, userId: string): Promise<void> {
    const key = `${platform}:${applicationId}`;

    // Stop existing if any
    const existing = this.bots.get(key);
    if (existing) {
      log('Stopping existing bot %s before restart', key);
      await existing.stop();
      this.bots.delete(key);
    }

    // Load from DB (user-scoped, single row)
    const serverDB = await getServerDB();
    const gateKeeper = await KeyVaultsGateKeeper.initWithEnvKey();
    const model = new AgentBotProviderModel(serverDB, userId, gateKeeper);
    const provider = await model.findEnabledByApplicationId(platform, applicationId);

    if (!provider) {
      log('No enabled provider found for %s', key);
      return;
    }

    const bot = this.createBot(platform, provider);
    if (!bot) {
      log('Unsupported platform: %s', platform);
      return;
    }

    await bot.start();
    this.bots.set(key, bot);
    log('Started bot %s', key);
  }

  async stopBot(platform: string, applicationId: string): Promise<void> {
    const key = `${platform}:${applicationId}`;
    const bot = this.bots.get(key);
    if (!bot) return;

    await bot.stop();
    this.bots.delete(key);
    log('Stopped bot %s', key);
  }

  // ------------------------------------------------------------------
  // DB sync
  // ------------------------------------------------------------------

  private async sync(): Promise<void> {
    try {
      await this.syncPlatform('discord');
    } catch (error) {
      log('Sync error: %O', error);
    }
  }

  private async syncPlatform(platform: string): Promise<void> {
    log('Sync: querying providers for platform=%s', platform);

    const serverDB = await getServerDB();
    const gateKeeper = await KeyVaultsGateKeeper.initWithEnvKey();
    const providers = await AgentBotProviderModel.findEnabledByPlatform(
      serverDB,
      platform,
      gateKeeper,
    );

    log('Sync: found %d enabled providers for %s', providers.length, platform);

    const activeKeys = new Set<string>();

    for (const provider of providers) {
      const { applicationId, credentials } = provider;
      const key = `${platform}:${applicationId}`;
      activeKeys.add(key);

      log('Sync: processing provider %s, hasCredentials=%s', key, !!credentials);

      const existing = this.bots.get(key);
      if (existing) {
        log('Sync: bot %s already running, skipping', key);
        continue;
      }

      const bot = this.createBot(platform, provider);
      if (!bot) {
        log('Sync: createBot returned null for %s', key);
        continue;
      }

      try {
        await bot.start();
        this.bots.set(key, bot);
        log('Sync: started bot %s', key);
      } catch (err) {
        log('Sync: failed to start bot %s: %O', key, err);
      }
    }

    // Stop bots that are no longer in DB
    for (const [key, bot] of this.bots) {
      if (!key.startsWith(`${platform}:`)) continue;
      if (activeKeys.has(key)) continue;

      log('Sync: bot %s removed from DB, stopping', key);
      await bot.stop();
      this.bots.delete(key);
    }
  }

  // ------------------------------------------------------------------
  // Factory
  // ------------------------------------------------------------------

  private createBot(
    platform: string,
    provider: { applicationId: string; credentials: any },
  ): PlatformBot | null {
    const { applicationId, credentials } = provider;

    if (platform === 'discord') {
      const { botToken, publicKey } = credentials;
      if (!botToken || !publicKey) {
        log('Missing credentials for discord:%s', applicationId);
        return null;
      }
      return new DiscordBot({
        applicationId,
        botToken,
        publicKey,
        webhookUrl: this.config.webhookUrl,
      });
    }

    return null;
  }
}

// ------------------------------------------------------------------
// Singleton
// ------------------------------------------------------------------

const globalForGateway = globalThis as unknown as { gatewayManager?: GatewayManager };

export function getGatewayManager(): GatewayManager | undefined {
  return globalForGateway.gatewayManager;
}

export function createGatewayManager(config: GatewayManagerConfig): GatewayManager {
  if (!globalForGateway.gatewayManager) {
    globalForGateway.gatewayManager = new GatewayManager(config);
  }
  return globalForGateway.gatewayManager;
}
