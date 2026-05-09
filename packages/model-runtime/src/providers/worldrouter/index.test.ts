// @vitest-environment node
import { ModelProvider } from 'model-bank';

import { testProvider } from '../../providerTestUtils';
import { LobeWorldRouterAI } from './index';

testProvider({
  Runtime: LobeWorldRouterAI,
  chatDebugEnv: 'DEBUG_WORLDROUTER_CHAT_COMPLETION',
  chatModel: 'claude-sonnet-4-6',
  defaultBaseURL: 'https://inference-api.worldrouter.ai/v1',
  provider: ModelProvider.WorldRouter,
  test: {
    skipAPICall: true,
  },
});
