import { getBotProviderManager } from '@/server/services/bot';

/**
 * Discord Webhook endpoint for Chat SDK.
 *
 * Discord sends interaction payloads here (slash commands, @mentions, etc.).
 * The Chat SDK Discord adapter handles signature verification (public key)
 * and routes events to the registered bot handlers.
 *
 * Route: POST /api/agent/webhooks/discord
 */
export const POST = async (req: Request): Promise<Response> => {
  const manager = getBotProviderManager();
  const handler = manager.getWebhookHandler('discord');
  return handler(req);
};
