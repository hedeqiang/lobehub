import { getBotProviderManager } from '@/server/services/bot';

/**
 * Unified webhook endpoint for Chat SDK bot platforms (Discord, Slack, etc.).
 *
 * Each platform adapter handles its own signature verification and event parsing.
 * The BotProviderManager routes the request to the correct Chat SDK bot instance.
 *
 * Route: POST /api/agent/webhooks/[platform]
 */
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ platform: string }> },
): Promise<Response> => {
  const { platform } = await params;
  const manager = getBotProviderManager();
  const handler = manager.getWebhookHandler(platform);
  return handler(req);
};
