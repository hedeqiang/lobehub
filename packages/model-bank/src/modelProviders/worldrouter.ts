import { type ModelProviderCard } from '@/types/llm';

const WorldRouter: ModelProviderCard = {
  apiKeyUrl: 'https://www.worldrouter.ai/dashboard/api-keys',
  chatModels: [],
  checkModel: 'gpt-5.4-mini',
  description:
    'WorldRouter is an OpenAI-compatible AI gateway that routes requests to top models from OpenAI, Anthropic, Google, DeepSeek, xAI, and more through a single API.',
  id: 'worldrouter',
  modelsUrl: 'https://www.worldrouter.ai/models',
  name: 'WorldRouter',
  settings: {
    proxyUrl: {
      placeholder: 'https://inference-api.worldrouter.ai/v1',
    },
    sdkType: 'openai',
    showModelFetcher: false,
  },
  url: 'https://www.worldrouter.ai',
};

export default WorldRouter;
