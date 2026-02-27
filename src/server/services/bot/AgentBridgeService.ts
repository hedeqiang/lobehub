import type { Message, Thread } from 'chat';
import debug from 'debug';

import { getServerDB } from '@/database/core/db-adaptor';
import { MessageModel } from '@/database/models/message';
import { StreamEventManager } from '@/server/modules/AgentRuntime';
import type { StreamEvent } from '@/server/modules/AgentRuntime/StreamEventManager';
import { AiAgentService } from '@/server/services/aiAgent';

const log = debug('lobe-server:bot:agent-bridge');

/**
 * Platform-agnostic bridge between Chat SDK events and Agent Runtime.
 *
 * Non-streaming mode: triggers agent execution, waits for completion,
 * reads the final assistant message from DB, and posts it at once.
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
      const reply = await this.executeAndWait(message.text, {
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
      const reply = await this.executeAndWait(message.text, {
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
   * Trigger agent execution, wait for it to complete,
   * then read the final assistant message from DB and return the text.
   */
  private async executeAndWait(
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

    const result = await aiAgentService.execAgent({
      agentId,
      appContext: topicId ? { topicId } : undefined,
      autoStart: true,
      prompt,
      stream: false,
      trigger,
      userInterventionConfig: { approvalMode: 'headless' },
    });

    log(
      'executeAndWait: operationId=%s, assistantMessageId=%s',
      result.operationId,
      result.assistantMessageId,
    );

    // Wait for agent_runtime_end event
    await this.waitForCompletion(result.operationId);

    // Read the final assistant message from DB
    const messageModel = new MessageModel(serverDB, userId);
    const assistantMessage = await messageModel.findById(result.assistantMessageId);

    if (!assistantMessage?.content) {
      throw new Error('Agent completed but no response content found');
    }

    log('executeAndWait: got response (%d chars)', assistantMessage.content.length);
    return assistantMessage.content;
  }

  /**
   * Subscribe to stream events and resolve when `agent_runtime_end` is received.
   */
  private waitForCompletion(operationId: string): Promise<void> {
    const streamManager = new StreamEventManager();
    const abortController = new AbortController();

    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => {
          abortController.abort();
          reject(new Error(`Agent execution timed out for operation ${operationId}`));
        },
        5 * 60 * 1000,
      ); // 5 minutes

      streamManager
        .subscribeStreamEvents(
          operationId,
          '0',
          (events: StreamEvent[]) => {
            for (const event of events) {
              if (event.type === 'agent_runtime_end') {
                clearTimeout(timeout);
                abortController.abort();
                resolve();
                return;
              }
              if (event.type === 'error') {
                clearTimeout(timeout);
                abortController.abort();
                reject(new Error(event.data?.message || 'Agent execution failed'));
                return;
              }
            }
          },
          abortController.signal,
        )
        .catch((err) => {
          // subscribeStreamEvents exits when aborted — ignore abort errors
          if (!abortController.signal.aborted) {
            clearTimeout(timeout);
            reject(err instanceof Error ? err : new Error(String(err)));
          }
        });
    });
  }
}
