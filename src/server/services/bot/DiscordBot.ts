import type { DiscordAdapter } from '@chat-adapter/discord';
import { createDiscordAdapter } from '@chat-adapter/discord';
import type { Lock, StateAdapter } from 'chat';
import { Chat } from 'chat';
import debug from 'debug';

import type { PlatformBot } from './types';

const log = debug('lobe-server:bot:gateway:discord');

const DEFAULT_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

class NoopStateAdapter implements StateAdapter {
  async connect() {}
  async disconnect() {}
  async get() {
    return null;
  }
  async set() {}
  async delete() {}
  async acquireLock(_threadId: string, _ttlMs: number): Promise<Lock | null> {
    return { expiresAt: Date.now() + _ttlMs, threadId: _threadId, token: 'noop' };
  }
  async extendLock() {
    return true;
  }
  async releaseLock() {}
  async isSubscribed() {
    return false;
  }
  async subscribe() {}
  async unsubscribe() {}
}

export interface DiscordBotConfig {
  applicationId: string;
  botToken: string;
  durationMs?: number;
  publicKey: string;
  webhookUrl: string;
}

export class DiscordBot implements PlatformBot {
  readonly platform = 'discord';
  readonly applicationId: string;

  private abort = new AbortController();
  private config: DiscordBotConfig;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private stopped = false;

  constructor(config: DiscordBotConfig) {
    this.config = config;
    this.applicationId = config.applicationId;
  }

  async start(): Promise<void> {
    log('Starting DiscordBot appId=%s', this.applicationId);

    this.stopped = false;
    this.abort = new AbortController();

    const adapter = createDiscordAdapter({
      applicationId: this.config.applicationId,
      botToken: this.config.botToken,
      publicKey: this.config.publicKey,
    });

    const bot = new Chat({
      adapters: { discord: adapter },
      state: new NoopStateAdapter(),
      userName: `lobehub-gateway-${this.applicationId}`,
    });

    await bot.initialize();

    const discordAdapter = (bot as any).adapters.get('discord') as DiscordAdapter;
    const durationMs = this.config.durationMs ?? DEFAULT_DURATION_MS;

    // startGatewayListener resolves immediately after starting the WS connection in background.
    // Use setTimeout for periodic refresh instead of chaining on the returned promise.
    await discordAdapter.startGatewayListener(
      {
        waitUntil: (task: Promise<any>) => {
          task.catch(() => {});
        },
      },
      durationMs,
      this.abort.signal,
      this.config.webhookUrl,
    );

    // Schedule a refresh after durationMs
    this.refreshTimer = setTimeout(() => {
      if (this.abort.signal.aborted || this.stopped) return;

      log(
        'DiscordBot appId=%s duration elapsed (%dh), refreshing...',
        this.applicationId,
        durationMs / 3_600_000,
      );
      this.abort.abort();
      this.start().catch((err) => {
        log('Failed to refresh DiscordBot appId=%s: %O', this.applicationId, err);
      });
    }, durationMs);

    log('DiscordBot appId=%s started', this.applicationId);
  }

  async stop(): Promise<void> {
    log('Stopping DiscordBot appId=%s', this.applicationId);
    this.stopped = true;
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.abort.abort();
  }
}
