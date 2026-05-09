import type { AIChatModelCard } from '../types/aiModel';

// https://www.worldrouter.ai/models
const worldrouterChatModels: AIChatModelCard[] = [
  // -------- Anthropic --------
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'Claude Opus 4.7 is Anthropic’s flagship model, leading on advanced reasoning, agentic tasks, and complex code generation.',
    displayName: 'Claude Opus 4.7',
    enabled: true,
    id: 'claude-opus-4-7',
    maxOutput: 32_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 3.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.35, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 4.375, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 17.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'Claude Opus 4.6 delivers top-tier reasoning and coding performance across agentic and long-context workloads.',
    displayName: 'Claude Opus 4.6',
    id: 'claude-opus-4-6',
    maxOutput: 32_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 3.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.35, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 4.375, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 17.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'Claude Sonnet 4.6 balances strong reasoning quality with faster response times — a great default for production workloads.',
    displayName: 'Claude Sonnet 4.6',
    enabled: true,
    id: 'claude-sonnet-4-6',
    maxOutput: 64_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 2.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.21, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 2.625, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 10.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'Claude Haiku 4.5 is Anthropic’s fast, cost-efficient model for quick tasks and high-volume applications.',
    displayName: 'Claude Haiku 4.5',
    enabled: true,
    id: 'claude-haiku-4-5',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.7, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.07, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.875, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- OpenAI --------
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 400_000,
    description:
      'GPT-5.5 is OpenAI’s frontier model, optimized for advanced reasoning, coding, and agentic workflows.',
    displayName: 'GPT-5.5',
    enabled: true,
    id: 'gpt-5.5',
    maxOutput: 128_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 3.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.35, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 3.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 21, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 400_000,
    description:
      'GPT-5.4 is OpenAI’s flagship general-purpose model with strong long-context, reasoning, and tool-use performance.',
    displayName: 'GPT-5.4',
    enabled: true,
    id: 'gpt-5.4',
    maxOutput: 128_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 1.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.175, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 10.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 400_000,
    description:
      'GPT-5.4 Mini is a smaller, faster variant of GPT-5.4 — ideal for cost-sensitive, high-throughput use cases.',
    displayName: 'GPT-5.4 Mini',
    enabled: true,
    id: 'gpt-5.4-mini',
    maxOutput: 128_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.525, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.0525, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3.15, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description:
      'GPT-OSS-120B is OpenAI’s open-weight model with strong reasoning capabilities, suitable for self-hosted-style routing.',
    displayName: 'GPT OSS 120B',
    id: 'gpt-oss-120b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.039, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.039, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.19, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'GPT-OSS-20B is the smaller open-weight model in the GPT-OSS series.',
    displayName: 'GPT OSS 20B',
    id: 'gpt-oss-20b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.03, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.03, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.14, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- Google --------
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576,
    description:
      'Gemini 3.1 Pro Preview is Google’s most capable Gemini model — strong reasoning, vision, and a 1M-token context window.',
    displayName: 'Gemini 3.1 Pro Preview',
    enabled: true,
    id: 'gemini-3.1-pro-preview',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput', rate: 1.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.14, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 8.4, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576,
    description:
      'Gemini 3.1 Flash Lite Preview is a fast, low-cost Gemini variant with vision and a 1M-token context window.',
    displayName: 'Gemini 3.1 Flash Lite Preview',
    enabled: true,
    id: 'gemini-3.1-flash-lite-preview',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.175, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.0175, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.05, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 32_768,
    description: 'Gemma 3 12B Instruction-Tuned is a lightweight open model from Google.',
    displayName: 'Gemma 3 12B IT',
    id: 'gemma-3-12b-it',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.04, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.04, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.13, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 32_768,
    description: 'Gemma 3 27B Instruction-Tuned is a mid-size open model from Google.',
    displayName: 'Gemma 3 27B IT',
    id: 'gemma-3-27b-it',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.08, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.08, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.16, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 131_072,
    description:
      'Gemma 4 26B A4B IT is Google’s next-gen multimodal Gemma instruction-tuned model with vision support.',
    displayName: 'Gemma 4 26B A4B IT',
    id: 'gemma-4-26b-a4b-it',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.06, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.06, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.33, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 131_072,
    description:
      'Gemma 4 31B IT is a larger Gemma 4 instruction-tuned variant with multimodal capabilities.',
    displayName: 'Gemma 4 31B IT',
    id: 'gemma-4-31b-it',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.13, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.13, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.38, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- DeepSeek --------
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description:
      'DeepSeek V4 Pro is DeepSeek’s flagship next-generation model with strong reasoning and code generation.',
    displayName: 'DeepSeek V4 Pro',
    enabled: true,
    id: 'deepseek-v4-pro',
    pricing: {
      units: [
        { name: 'textInput', rate: 1.218, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.1015, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 1.218, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.436, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'DeepSeek V4 Flash is a fast, cost-efficient variant of the DeepSeek V4 series.',
    displayName: 'DeepSeek V4 Flash',
    id: 'deepseek-v4-flash',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.098, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.0196, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.098, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.196, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'DeepSeek V3.2 is a hybrid reasoning model with efficient mode switching.',
    displayName: 'DeepSeek V3.2',
    enabled: true,
    id: 'deepseek-v3.2',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.196, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.0196, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.294, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'DeepSeek V3.2 Exp is an experimental variant of DeepSeek V3.2.',
    displayName: 'DeepSeek V3.2 Exp',
    id: 'deepseek-v3.2-exp',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.27, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.27, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.41, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description: 'DeepSeek V3.1 Terminus is a stable release variant of the V3.1 model line.',
    displayName: 'DeepSeek V3.1 Terminus',
    id: 'deepseek-v3.1-terminus',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.21, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.13, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.21, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.79, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'DeepSeek Chat V3.1 with hybrid reasoning and tool-use capabilities.',
    displayName: 'DeepSeek Chat V3.1',
    id: 'deepseek-chat-v3.1',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.15, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.15, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 65_536,
    description: 'DeepSeek Chat V3 (0324) — the original V3 chat checkpoint.',
    displayName: 'DeepSeek Chat V3 0324',
    id: 'deepseek-chat-v3-0324',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.135, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.77, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- xAI --------
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 256_000,
    description:
      'Grok 4.20 is xAI’s latest flagship Grok model with strong reasoning and multimodal capabilities.',
    displayName: 'Grok 4.20',
    id: 'grok-4.20',
    pricing: {
      units: [
        { name: 'textInput', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 6, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 256_000,
    description: 'Grok 4.1 Fast is a faster, cost-efficient Grok variant.',
    displayName: 'Grok 4.1 Fast',
    id: 'grok-4.1-fast',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 256_000,
    description: 'Grok 4 Fast is a fast, cost-efficient Grok 4 variant.',
    displayName: 'Grok 4 Fast',
    id: 'grok-4-fast',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- Zhipu --------
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'GLM-5 is Zhipu’s next-generation flagship general-purpose model.',
    displayName: 'GLM-5',
    id: 'glm-5',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.7, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.14, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.24, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'GLM-5 Turbo is a faster, higher-throughput variant of GLM-5.',
    displayName: 'GLM-5 Turbo',
    id: 'glm-5-turbo',
    pricing: {
      units: [
        { name: 'textInput', rate: 1.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.24, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 1.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 4, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'GLM-5.1 is an updated revision of GLM-5 with improvements across the board.',
    displayName: 'GLM-5.1',
    id: 'glm-5.1',
    pricing: {
      units: [
        { name: 'textInput', rate: 1.12, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.182, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.98, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3.52, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'GLM-4.7 is Zhipu’s upgraded GLM-4 series flagship model.',
    displayName: 'GLM-4.7',
    id: 'glm-4.7',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.38, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.38, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.74, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description: 'GLM-4.7 Flash is a fast, low-latency variant of GLM-4.7.',
    displayName: 'GLM-4.7 Flash',
    id: 'glm-4.7-flash',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.06, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.01, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.06, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'GLM-4.6 is the previous-generation Zhipu flagship model.',
    displayName: 'GLM-4.6',
    id: 'glm-4.6',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.39, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.39, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.9, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description: 'GLM-4.5 Air is a lightweight Zhipu model designed for low-cost workloads.',
    displayName: 'GLM-4.5 Air',
    id: 'glm-4.5-air',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.13, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.025, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.13, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.85, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- Moonshot --------
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'Kimi K2.6 is Moonshot’s latest Kimi flagship model, with strong reasoning.',
    displayName: 'Kimi K2.6',
    id: 'kimi-k2.6',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.665, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.112, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.665, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.8, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'Kimi K2.5 is Moonshot’s previous Kimi flagship.',
    displayName: 'Kimi K2.5',
    id: 'kimi-k2.5',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.42, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.07, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.1, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- Meta --------
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 131_072,
    description:
      'Llama 4 Maverick is a large MoE model with efficient expert activation and multimodal capabilities.',
    displayName: 'Llama 4 Maverick',
    id: 'llama-4-maverick',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.15, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.15, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.6, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description: 'Llama 3.3 70B Instruct is Meta’s instruction-tuned 70B model.',
    displayName: 'Llama 3.3 70B Instruct',
    id: 'llama-3.3-70b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.32, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description: 'Llama 3.1 70B Instruct is the 70B variant of Meta Llama 3.1.',
    displayName: 'Llama 3.1 70B Instruct',
    id: 'llama-3.1-70b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 131_072,
    description: 'Llama 3.1 8B Instruct is a small, fast Meta model.',
    displayName: 'Llama 3.1 8B Instruct',
    id: 'llama-3.1-8b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.02, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.02, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- Xiaomi MiMo --------
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'MiMo V2.5 Pro is Xiaomi’s upgraded flagship MiMo text model.',
    displayName: 'MiMo V2.5 Pro',
    id: 'mimo-v2.5-pro',
    pricing: {
      units: [
        { name: 'textInput', rate: 1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 131_072,
    description: 'MiMo V2.5 is Xiaomi’s native omni-modal MiMo model.',
    displayName: 'MiMo V2.5',
    id: 'mimo-v2.5',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.08, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'MiMo V2 Pro is the high-end MiMo V2 text model.',
    displayName: 'MiMo V2 Pro',
    id: 'mimo-v2-pro',
    pricing: {
      units: [
        { name: 'textInput', rate: 1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 131_072,
    description: 'MiMo V2 Omni is the multimodal MiMo V2 variant.',
    displayName: 'MiMo V2 Omni',
    id: 'mimo-v2-omni',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.08, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description: 'MiMo V2 Flash is a fast, cost-efficient MiMo V2 variant.',
    displayName: 'MiMo V2 Flash',
    id: 'mimo-v2-flash',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.09, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.045, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.09, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.29, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- MiniMax --------
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 1_000_000,
    description: 'MiniMax M2.7 is the latest MiniMax flagship model with long-context support.',
    displayName: 'MiniMax M2.7',
    id: 'MiniMax-M2.7',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.21, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.042, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.2625, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.84, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 1_000_000,
    description: 'MiniMax M2.5 is a long-context MiniMax model with strong reasoning.',
    displayName: 'MiniMax M2.5',
    id: 'MiniMax-M2.5',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.21, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.021, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.2625, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.84, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- Mistral --------
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 131_072,
    description: 'Mistral Small 3.2 24B Instruct is a compact, capable instruction-tuned model.',
    displayName: 'Mistral Small 3.2 24B Instruct',
    id: 'mistral-small-3.2-24b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.075, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.075, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description: 'Mistral Nemo is a 12B model designed for low-cost, fast inference.',
    displayName: 'Mistral Nemo',
    id: 'mistral-nemo',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.02, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.02, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.04, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- NVIDIA --------
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'Nemotron 3 Super 120B A12B is NVIDIA’s flagship Nemotron 3 model.',
    displayName: 'Nemotron 3 Super 120B A12B',
    id: 'nemotron-3-super-120b-a12b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.09, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.09, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.45, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description: 'Nemotron 3 Nano 30B A3B is a compact NVIDIA Nemotron model.',
    displayName: 'Nemotron 3 Nano 30B A3B',
    id: 'nemotron-3-nano-30b-a3b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- Alibaba (Qwen) --------
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3.6 Plus is Alibaba’s upgraded flagship Qwen 3.6 model.',
    displayName: 'Qwen 3.6 Plus',
    id: 'qwen3.6-plus',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.1932, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.01932, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.2415, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.1557, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3.5 Plus is Alibaba’s flagship Qwen 3.5 chat model.',
    displayName: 'Qwen 3.5 Plus',
    id: 'qwen3.5-plus',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.0805, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.00805, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.1006, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.4816, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3.5 Plus 02-15 is a dated checkpoint of Qwen 3.5 Plus.',
    displayName: 'Qwen 3.5 Plus 02-15',
    id: 'qwen3.5-plus-02-15',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.04, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.4, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3.5 Flash is a fast, cost-efficient Qwen 3.5 variant.',
    displayName: 'Qwen 3.5 Flash',
    id: 'qwen3.5-flash',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.0203, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.00203, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.0254, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.2009, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3.5 Flash 02-23 is a dated checkpoint of Qwen 3.5 Flash.',
    displayName: 'Qwen 3.5 Flash 02-23',
    id: 'qwen3.5-flash-02-23',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.01, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.125, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3.5 397B A17B is a large Qwen 3.5 MoE model.',
    displayName: 'Qwen 3.5 397B A17B',
    id: 'qwen3.5-397b-a17b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.39, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.195, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.39, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.34, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3.5 35B A3B is a mid-size Qwen 3.5 MoE model.',
    displayName: 'Qwen 3.5 35B A3B',
    id: 'qwen3.5-35b-a3b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3.5 27B is a dense Qwen 3.5 model.',
    displayName: 'Qwen 3.5 27B',
    id: 'qwen3.5-27b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.4, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description: 'Qwen 3.5 9B is a smaller dense Qwen 3.5 model.',
    displayName: 'Qwen 3.5 9B',
    id: 'qwen3.5-9b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.15, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3 VL 235B A22B Instruct is the multimodal Qwen 3 vision-language model.',
    displayName: 'Qwen 3 VL 235B A22B Instruct',
    id: 'qwen3-vl-235b-a22b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.11, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.88, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3 Next 80B A3B Instruct is an efficient Qwen 3 MoE instruction model.',
    displayName: 'Qwen 3 Next 80B A3B Instruct',
    id: 'qwen3-next-80b-a3b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.09, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.09, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.1, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3 Coder Plus is a high-end Qwen 3 model tuned for code.',
    displayName: 'Qwen 3 Coder Plus',
    id: 'qwen3-coder-plus',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.4018, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.04018, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.5023, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.6058, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3 Coder Next is a fast Qwen 3 coding-tuned model.',
    displayName: 'Qwen 3 Coder Next',
    id: 'qwen3-coder-next',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.14, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.09, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.14, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.8, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3 Coder is the standard Qwen 3 model tuned for code generation.',
    displayName: 'Qwen 3 Coder',
    id: 'qwen3-coder',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.22, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.22, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.8, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description: 'Qwen 3 32B is a dense Qwen 3 chat model.',
    displayName: 'Qwen 3 32B',
    id: 'qwen3-32b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.08, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.04, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.08, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.24, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3 30B A3B Instruct 2507 is a Qwen 3 MoE instruction model checkpoint.',
    displayName: 'Qwen 3 30B A3B Instruct 2507',
    id: 'qwen3-30b-a3b-instruct-2507',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.09, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.09, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 262_144,
    description: 'Qwen 3 235B A22B 2507 is a large Qwen 3 MoE checkpoint.',
    displayName: 'Qwen 3 235B A22B 2507',
    id: 'qwen3-235b-a22b-2507',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.071, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.071, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },

  // -------- StepFun --------
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description: 'Step 3.5 Flash is a fast, cost-efficient StepFun Step 3.5 model.',
    displayName: 'Step 3.5 Flash',
    id: 'step-3.5-flash',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
];

export const allModels = [...worldrouterChatModels];

export default allModels;
