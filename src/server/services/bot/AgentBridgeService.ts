import type { Message, Thread } from 'chat';
import debug from 'debug';

import { getServerDB } from '@/database/core/db-adaptor';
import { MessageModel } from '@/database/models/message';
import { AiAgentService } from '@/server/services/aiAgent';

const log = debug('lobe-server:bot:agent-bridge');

const EXECUTION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

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
    thread: Thread,
    message: Message,
    opts: { agentId: string; userId: string },
  ): Promise<void> {
    const { agentId, userId } = opts;

    log('handleMention: agentId=%s, user=%s, text=%s', agentId, userId, message.text.slice(0, 80));

    await thread.subscribe();
    await thread.startTyping();

    try {
      const reply = await this.executeWithCallback(message.text, {
        agentId,
        trigger: 'api',
        userId,
      });
      await thread.post(reply);
    } catch (error) {
      log('handleMention error: %O', error);
      await thread.post(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle a follow-up message inside a subscribed thread — multi-turn conversation.
   */
  async handleSubscribedMessage(
    thread: Thread,
    message: Message,
    opts: { agentId: string; topicId: string; userId: string },
  ): Promise<void> {
    const { agentId, userId, topicId } = opts;

    log('handleSubscribedMessage: agentId=%s, topicId=%s', agentId, topicId);

    await thread.startTyping();

    try {
      const reply = await this.executeWithCallback(message.text, {
        agentId,
        topicId,
        trigger: 'bot',
        userId,
      });

      await thread.post(reply);
    } catch (error) {
      log('handleSubscribedMessage error: %O', error);
      await thread.post(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Trigger agent execution and wait for completion via onComplete callback.
   */
  private async executeWithCallback(
    prompt: string,
    opts: {
      agentId: string;
      topicId?: string;
      trigger?: string;
      userId: string;
    },
  ): Promise<string> {
    const { agentId, userId, topicId, trigger } = opts;

    const serverDB = await getServerDB();
    const aiAgentService = new AiAgentService(serverDB, userId);
    const messageModel = new MessageModel(serverDB, userId);

    return new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Agent execution timed out`));
      }, EXECUTION_TIMEOUT);

      let assistantMessageId: string;

      aiAgentService
        .execAgent({
          agentId,
          appContext: topicId ? { topicId } : undefined,
          autoStart: true,
          prompt,
          stepCallbacks: {
            onComplete: async ({ finalState, reason }) => {
              clearTimeout(timeout);

              log(
                'onComplete: reason=%s, assistantMessageId=%s',
                reason,
                assistantMessageId,
              );

              if (reason === 'error') {
                const errorMsg =
                  finalState.error?.message || finalState.error || 'Agent execution failed';
                reject(new Error(String(errorMsg)));
                return;
              }

              try {
                const assistantMessage = await messageModel.findById(assistantMessageId);

                if (!assistantMessage?.content) {
                  reject(new Error('Agent completed but no response content found'));
                  return;
                }

                log('executeWithCallback: got response (%d chars)', assistantMessage.content.length);
                resolve(assistantMessage.content);
              } catch (error) {
                reject(error);
              }
            },
          },
          stream: false,
          trigger,
          userInterventionConfig: { approvalMode: 'headless' },
        })
        .then((result) => {
          assistantMessageId = result.assistantMessageId;

          log(
            'executeWithCallback: operationId=%s, assistantMessageId=%s',
            result.operationId,
            result.assistantMessageId,
          );
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }
}
