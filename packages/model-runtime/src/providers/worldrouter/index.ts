import { ModelProvider } from 'model-bank';

import { createOpenAICompatibleRuntime } from '../../core/openaiCompatibleFactory';

export const LobeWorldRouterAI = createOpenAICompatibleRuntime({
  baseURL: 'https://inference-api.worldrouter.ai/v1',
  debug: {
    chatCompletion: () => process.env.DEBUG_WORLDROUTER_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.WorldRouter,
});
