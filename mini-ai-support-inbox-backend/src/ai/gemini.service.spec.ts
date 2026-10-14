import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ConfigService } from '@nestjs/config';

const { geminiGenerate, groqCompletionCreate } = vi.hoisted(() => ({
  geminiGenerate: vi.fn(),
  groqCompletionCreate: vi.fn(),
}));

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn(function GoogleGenAIMock() {
    return {
      models: { generateContent: geminiGenerate },
    };
  }),
  Type: { OBJECT: 'OBJECT', STRING: 'STRING' },
}));

vi.mock('groq-sdk', () => ({
  default: vi.fn(function GroqMock() {
    return {
      chat: { completions: { create: groqCompletionCreate } },
    };
  }),
}));

import { GeminiService } from './gemini.service.js';

describe('GeminiService', () => {
  const generatedContent = {
    category: 'inquiry',
    generatedReply: 'Thanks for contacting us.',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns Gemini response without calling Groq when Gemini succeeds', async () => {
    geminiGenerate.mockResolvedValueOnce({
      text: JSON.stringify(generatedContent),
    });

    const generation =
      createService().generateMessageContent('Where is my order?');

    await expect(generation).resolves.toEqual(generatedContent);
    expect(geminiGenerate).toHaveBeenCalledTimes(1);
    expect(groqCompletionCreate).not.toHaveBeenCalled();
  });

  it.each([400, 429, 503])(
    'uses Groq immediately after Gemini returns status %i',
    async (status) => {
      geminiGenerate.mockRejectedValueOnce(providerError(status));
      groqCompletionCreate.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(generatedContent) } }],
      });

      const generation =
        createService().generateMessageContent('Where is my order?');

      await expect(generation).resolves.toEqual(generatedContent);
      expect(geminiGenerate).toHaveBeenCalledTimes(1);
      expect(groqCompletionCreate).toHaveBeenCalledTimes(1);
      expect(groqCompletionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-oss-20b',
          max_completion_tokens: 2048,
          reasoning_effort: 'low',
        }),
      );
      expect(
        groqCompletionCreate.mock.calls[0][0].messages[0].content,
      ).toContain('JSON object');
    },
  );

  it('uses Groq when Gemini returns an invalid response', async () => {
    geminiGenerate.mockResolvedValueOnce({ text: '{invalid json' });
    groqCompletionCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(generatedContent) } }],
    });

    const generation =
      createService().generateMessageContent('Where is my order?');

    await expect(generation).resolves.toEqual(generatedContent);
    expect(geminiGenerate).toHaveBeenCalledTimes(1);
    expect(groqCompletionCreate).toHaveBeenCalledTimes(1);
  });
});

function createService(): GeminiService {
  const configService = {
    getOrThrow: (key: string) =>
      key === 'GEMINI_API_KEY' ? 'gemini-test-key' : 'gemini-test-model',
    get: (key: string) => {
      if (key === 'GROQ_API_KEY') return 'groq-test-key';
      return undefined;
    },
  } as unknown as ConfigService;

  return new GeminiService(configService);
}

function providerError(status: number): Error & { status: number; } {
  return Object.assign(new Error('Provider unavailable'), { status });
}
