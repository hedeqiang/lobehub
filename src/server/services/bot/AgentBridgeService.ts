import type { ChatTopicBotContext } from '@lobechat/types';
import type { Message, Thread } from 'chat';
import debug from 'debug';

import { getServerDB } from '@/database/core/db-adaptor';
import { MessageModel } from '@/database/models/message';
import { AiAgentService } from '@/server/services/aiAgent';

const log = debug('lobe-server:bot:agent-bridge');

const EXECUTION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Extract a human-readable error message from agent runtime error objects.
 * Handles various shapes: string, { message }, { errorType, error: { stack } }, etc.
 */
function extractErrorMessage(err: unknown): string {
  if (!err) return 'Agent execution failed';
  if (typeof err === 'string') return err;

  const e = err as Record<string, any>;

  // { message: '...' }
  if (typeof e.message === 'string') return e.message;

  // { errorType: 'ProviderBizError', error: { stack: 'Error: ...\n  at ...' } }
  if (e.error?.stack) {
    const firstLine = String(e.error.stack).split('\n')[0];
    const prefix = e.errorType ? `[${e.errorType}] ` : '';
    return `${prefix}${firstLine}`;
  }

  // { body: { message: '...' } }
  if (typeof e.body?.message === 'string') return e.body.message;

  return JSON.stringify(err);
}

/**
 * Platform-agnostic bridge between Chat SDK events and Agent Runtime.
 *
 * Uses in-process onComplete callback to get agent execution results.
 */
export class AgentBridgeService {
  /**
   * Handle a new @mention — start a fresh conversation.
   */
  async handleMention(
    thread: Thread<{ topicId?: string }>,
    message: Message,
    opts: { agentId: string; botContext?: ChatTopicBotContext; userId: string },
  ): Promise<void> {
    const { agentId, botContext, userId } = opts;

    log('handleMention: agentId=%s, user=%s, text=%s', agentId, userId, message.text.slice(0, 80));

    await thread.subscribe();
    await thread.startTyping();

    try {
      const { reply, topicId } = await this.executeWithCallback(message.text, {
        agentId,
        botContext,
        trigger: 'bot',
        userId,
      });

      // Persist topic mapping in thread state for follow-up messages
      if (topicId) {
        await thread.setState({ topicId });
        log('handleMention: stored topicId=%s in thread=%s state', topicId, thread.id);
      }

      await thread.post(reply);
    } catch (error) {
      log('handleMention error: %O', error);
      const msg = error instanceof Error ? error.message : String(error);
      await thread.post(`**Agent Execution Failed**\n\`\`\`\n${msg}\n\`\`\``);
    }
  }

  /**
   * Handle a follow-up message inside a subscribed thread — multi-turn conversation.
   */
  async handleSubscribedMessage(
    thread: Thread<{ topicId?: string }>,
    message: Message,
    opts: { agentId: string; botContext?: ChatTopicBotContext; userId: string },
  ): Promise<void> {
    const { agentId, botContext, userId } = opts;
    const threadState = await thread.state;
    const topicId = threadState?.topicId;

    log('handleSubscribedMessage: agentId=%s, thread=%s, topicId=%s', agentId, thread.id, topicId);

    if (!topicId) {
      log('handleSubscribedMessage: no topicId in thread state, treating as new mention');
      return this.handleMention(thread, message, { agentId, botContext, userId });
    }

    await thread.startTyping();

    try {
      const { reply } = await this.executeWithCallback(message.text, {
        agentId,
        topicId,
        trigger: 'bot',
        userId,
      });

      await thread.post(reply);
    } catch (error) {
      log('handleSubscribedMessage error: %O', error);
      const msg = error instanceof Error ? error.message : String(error);
      await thread.post(`**Agent Execution Failed**. Details:\n\`\`\`\n${msg}\n\`\`\``);
    }
  }

  /**
   * Trigger agent execution and wait for completion via onComplete callback.
   */
  private async executeWithCallback(
    prompt: string,
    opts: {
      agentId: string;
      botContext?: ChatTopicBotContext;
      topicId?: string;
      trigger?: string;
      userId: string;
    },
  ): Promise<{ reply: string; topicId: string }> {
    const { agentId, botContext, userId, topicId, trigger } = opts;

    const serverDB = await getServerDB();
    const aiAgentService = new AiAgentService(serverDB, userId);
    const messageModel = new MessageModel(serverDB, userId);

    return new Promise<{ reply: string; topicId: string }>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Agent execution timed out`));
      }, EXECUTION_TIMEOUT);

      let assistantMessageId: string;
      let resolvedTopicId: string;

      aiAgentService
        .execAgent({
          agentId,
          appContext: topicId ? { topicId } : undefined,
          autoStart: true,
          botContext,
          prompt,
          stepCallbacks: {
            onComplete: async ({ finalState, reason }) => {
              clearTimeout(timeout);

              log('onComplete: reason=%s, assistantMessageId=%s', reason, assistantMessageId);

              if (reason === 'error') {
                reject(new Error(extractErrorMessage(finalState.error)));
                return;
              }

              try {
                // Extract reply from finalState.messages (accumulated across all steps)
                // instead of reading from DB, because each step overwrites the assistant
                // message — a final empty step would clear the content in DB.
                const lastAssistantContent = finalState.messages
                  ?.slice()
                  .reverse()
                  .find(
                    (m: { content?: string; role: string }) => m.role === 'assistant' && m.content,
                  )?.content;

                if (lastAssistantContent) {
                  log(
                    'executeWithCallback: got response from finalState (%d chars)',
                    lastAssistantContent.length,
                  );
                  resolve({ reply: lastAssistantContent, topicId: resolvedTopicId });
                  return;
                }

                // Fallback: try reading from DB
                const assistantMessage = await messageModel.findById(assistantMessageId);

                if (!assistantMessage?.content) {
                  reject(new Error('Agent completed but no response content found'));
                  return;
                }

                log(
                  'executeWithCallback: got response from DB (%d chars)',
                  assistantMessage.content.length,
                );
                resolve({ reply: assistantMessage.content, topicId: resolvedTopicId });
              } catch (error) {
                reject(error);
              }
            },
          },
          trigger,
          userInterventionConfig: { approvalMode: 'headless' },
        })
        .then((result) => {
          assistantMessageId = result.assistantMessageId;
          resolvedTopicId = result.topicId;

          log(
            'executeWithCallback: operationId=%s, assistantMessageId=%s, topicId=%s',
            result.operationId,
            result.assistantMessageId,
            result.topicId,
          );
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }
}
