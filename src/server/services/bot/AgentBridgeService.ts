import type { ChatTopicBotContext } from '@lobechat/types';
import type { Message, SentMessage, Thread } from 'chat';
import { emoji } from 'chat';
import debug from 'debug';

import { getServerDB } from '@/database/core/db-adaptor';
import { AiAgentService } from '@/server/services/aiAgent';

import { randomAck } from './ackPhrases';

const log = debug('lobe-server:bot:agent-bridge');

const EXECUTION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Status emoji added on receive, removed on complete
const RECEIVED_EMOJI = emoji.eyes;

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
 * Fire-and-forget wrapper for reaction operations.
 * Reactions should never block or fail the main flow.
 */
async function safeReaction(fn: () => Promise<void>, label: string): Promise<void> {
  try {
    await fn();
  } catch (error) {
    log('safeReaction [%s] failed: %O', label, error);
  }
}

interface BridgeHandlerOpts {
  agentId: string;
  botContext?: ChatTopicBotContext;
  userId: string;
}

/**
 * Platform-agnostic bridge between Chat SDK events and Agent Runtime.
 *
 * Uses in-process onComplete callback to get agent execution results.
 * Provides real-time feedback via emoji reactions and editable progress messages.
 */
export class AgentBridgeService {
  /**
   * Handle a new @mention — start a fresh conversation.
   */
  async handleMention(
    thread: Thread<{ topicId?: string }>,
    message: Message,
    opts: BridgeHandlerOpts,
  ): Promise<void> {
    const { agentId, botContext, userId } = opts;

    log('handleMention: agentId=%s, user=%s, text=%s', agentId, userId, message.text.slice(0, 80));

    // Immediate feedback: mark as received + show typing
    await safeReaction(
      () => thread.adapter.addReaction(thread.id, message.id, RECEIVED_EMOJI),
      'add eyes',
    );
    await thread.subscribe();
    await thread.startTyping();

    try {
      // executeWithCallback handles progress message (post + edit at each step)
      // The final reply is edited into the progress message by onComplete
      const { topicId } = await this.executeWithCallback(thread, message, {
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
    } catch (error) {
      log('handleMention error: %O', error);
      const msg = error instanceof Error ? error.message : String(error);
      await thread.post(`**Agent Execution Failed**\n\`\`\`\n${msg}\n\`\`\``);
    } finally {
      // Always clean up reactions
      await this.removeReceivedReaction(thread, message);
    }
  }

  /**
   * Handle a follow-up message inside a subscribed thread — multi-turn conversation.
   */
  async handleSubscribedMessage(
    thread: Thread<{ topicId?: string }>,
    message: Message,
    opts: BridgeHandlerOpts,
  ): Promise<void> {
    const { agentId, botContext, userId } = opts;
    const threadState = await thread.state;
    const topicId = threadState?.topicId;

    log('handleSubscribedMessage: agentId=%s, thread=%s, topicId=%s', agentId, thread.id, topicId);

    if (!topicId) {
      log('handleSubscribedMessage: no topicId in thread state, treating as new mention');
      return this.handleMention(thread, message, { agentId, botContext, userId });
    }

    // Immediate feedback: mark as received + show typing
    await safeReaction(
      () => thread.adapter.addReaction(thread.id, message.id, RECEIVED_EMOJI),
      'add eyes',
    );
    await thread.startTyping();

    try {
      // executeWithCallback handles progress message (post + edit at each step)
      await this.executeWithCallback(thread, message, {
        agentId,
        topicId,
        trigger: 'bot',
        userId,
      });
    } catch (error) {
      log('handleSubscribedMessage error: %O', error);
      const msg = error instanceof Error ? error.message : String(error);
      await thread.post(`**Agent Execution Failed**. Details:\n\`\`\`\n${msg}\n\`\`\``);
    } finally {
      await this.removeReceivedReaction(thread, message);
    }
  }

  /**
   * Trigger agent execution and wait for completion via onComplete callback.
   * Posts an editable progress message and updates it at each step.
   */
  private async executeWithCallback(
    thread: Thread<{ topicId?: string }>,
    userMessage: Message,
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

    // Post initial progress message
    let progressMessage: SentMessage | undefined;
    try {
      progressMessage = await thread.post(randomAck());
    } catch (error) {
      log('executeWithCallback: failed to post progress message: %O', error);
    }

    // Track the last LLM content for showing during tool execution
    let lastLLMContent = '';

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
          prompt: userMessage.text,
          stepCallbacks: {
            onAfterStep: async ({ stepResult, shouldContinue }) => {
              if (!shouldContinue || !progressMessage) return;

              // Extract LLM content from this step
              const llmEvent = stepResult?.events?.find(
                (e: { type: string }) => e.type === 'llm_result',
              );
              if (llmEvent) {
                const content = (llmEvent as any)?.result?.content;
                if (content) lastLLMContent = content;
              }

              // Build progress text based on next step type
              const nextPhase = stepResult?.nextContext?.phase;
              let progressText = '';

              if (nextPhase === 'tool_result' || nextPhase === 'tools_batch_result') {
                // LLM step just finished, tool execution is next
                const toolCalls = (llmEvent as any)?.result?.tool_calls;
                const toolNames = Array.isArray(toolCalls)
                  ? toolCalls.map((tc: any) => tc.function?.name || 'tool').join(', ')
                  : 'tool';

                progressText = lastLLMContent
                  ? `${lastLLMContent}\n\n${emoji.wrench} Calling ${toolNames}...`
                  : `${emoji.wrench} Calling ${toolNames}...`;
              } else {
                // Tool step just finished, LLM is next
                progressText = lastLLMContent
                  ? `${lastLLMContent}\n\n${emoji.thinking} Processing...`
                  : `${emoji.thinking} Processing...`;
              }

              try {
                progressMessage = await progressMessage.edit(progressText);
              } catch (error) {
                log('executeWithCallback: failed to edit progress message: %O', error);
              }
            },

            onComplete: async ({ finalState, reason }) => {
              clearTimeout(timeout);

              log('onComplete: reason=%s, assistantMessageId=%s', reason, assistantMessageId);

              if (reason === 'error') {
                // Update progress message with error
                if (progressMessage) {
                  try {
                    await progressMessage.edit(
                      `**Agent Execution Failed**\n\`\`\`\n${extractErrorMessage(finalState.error)}\n\`\`\``,
                    );
                  } catch {
                    // ignore edit failure
                  }
                }
                reject(new Error(extractErrorMessage(finalState.error)));
                return;
              }

              try {
                // Extract reply from finalState.messages (accumulated across all steps)
                const lastAssistantContent = finalState.messages
                  ?.slice()
                  .reverse()
                  .find(
                    (m: { content?: string; role: string }) => m.role === 'assistant' && m.content,
                  )?.content;

                if (lastAssistantContent) {
                  // Update progress message to final reply
                  if (progressMessage) {
                    try {
                      await progressMessage.edit(lastAssistantContent);
                    } catch (error) {
                      log('executeWithCallback: failed to edit final progress message: %O', error);
                    }
                  }

                  log(
                    'executeWithCallback: got response from finalState (%d chars)',
                    lastAssistantContent.length,
                  );
                  resolve({ reply: lastAssistantContent, topicId: resolvedTopicId });
                  return;
                }

                reject(new Error('Agent completed but no response content found'));
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

  /**
   * Remove the received reaction from a user message (fire-and-forget).
   */
  private async removeReceivedReaction(
    thread: Thread<{ topicId?: string }>,
    message: Message,
  ): Promise<void> {
    await safeReaction(
      () => thread.adapter.removeReaction(thread.id, message.id, RECEIVED_EMOJI),
      'remove eyes',
    );
  }
}
