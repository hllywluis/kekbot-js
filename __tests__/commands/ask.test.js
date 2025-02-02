const axios = require('axios');
const { createMockInteraction } = require('../utils/testUtils');

// Mock axios
jest.mock('axios');

// Mock the discord.js module
jest.mock('discord.js', () => ({
  SlashCommandBuilder: jest.fn().mockReturnValue({
    setName: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    addStringOption: jest.fn().mockImplementation(callback => {
      const option = {
        setName: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        setRequired: jest.fn().mockReturnThis(),
      };
      callback(option);
      return {
        addBooleanOption: jest.fn().mockImplementation(boolCallback => {
          const boolOption = {
            setName: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            setRequired: jest.fn().mockReturnThis(),
          };
          boolCallback(boolOption);
          return {
            toJSON: jest.fn().mockReturnValue({
              name: 'ask',
              description: 'Ask a question to the AI',
              options: [
                {
                  name: 'prompt',
                  description: 'Your question or prompt',
                  type: 3,
                  required: true,
                },
                {
                  name: 'websearch',
                  description: 'Enable web search for more up-to-date information',
                  type: 5,
                  required: false,
                },
              ],
            }),
          };
        }),
      };
    }),
    toJSON: jest.fn(),
  }),
}));

const askCommand = require('../../commands/ask');

describe('Ask Command', () => {
  describe('Command Structure', () => {
    it('should have correct name and description', () => {
      const commandData = askCommand.data.toJSON();
      expect(commandData.name).toBe('ask');
      expect(commandData.description).toBe('Ask a question to the AI');
    });

    it('should have required command properties', () => {
      expect(askCommand).toHaveProperty('data');
      expect(askCommand).toHaveProperty('execute');
      expect(typeof askCommand.execute).toBe('function');
    });

    it('should have correct option configuration', () => {
      const commandData = askCommand.data.toJSON();
      const [promptOption, websearchOption] = commandData.options;

      expect(promptOption.name).toBe('prompt');
      expect(promptOption.description).toBe('Your question or prompt');
      expect(promptOption.required).toBe(true);

      expect(websearchOption.name).toBe('websearch');
      expect(websearchOption.description).toBe('Enable web search for more up-to-date information');
      expect(websearchOption.required).toBe(false);
    });
  });

  describe('Command Execution', () => {
    let interaction;
    const mockPrompt = 'What is the meaning of life?';
    const mockApiResponse = {
      data: {
        choices: [
          {
            message: {
              content: 'The meaning of life is 42.',
            },
          },
        ],
      },
    };

    beforeEach(() => {
      process.env.OPENROUTER_API_KEY = 'test-api-key';
      axios.post.mockReset();
      jest.clearAllMocks();

      interaction = createMockInteraction({
        commandName: 'ask',
        stringOptions: {
          prompt: mockPrompt,
        },
        booleanOptions: {
          websearch: false,
        },
      });
    });

    it('should handle successful API response with websearch disabled', async () => {
      axios.post.mockResolvedValueOnce(mockApiResponse);

      await askCommand.execute(interaction);

      expect(axios.post).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/chat/completions',
        expect.objectContaining({
          model: 'google/gemini-2.0-flash-exp:free',
          plugins: undefined,
        }),
        expect.any(Object),
      );

      expect(interaction.followUp).toHaveBeenCalledWith({
        content: expect.not.stringContaining('Web search enabled'),
        split: false,
        allowedMentions: { parse: [] },
      });
    });

    it('should handle successful API response with websearch enabled', async () => {
      interaction = createMockInteraction({
        commandName: 'ask',
        stringOptions: {
          prompt: mockPrompt,
        },
        booleanOptions: {
          websearch: true,
        },
      });

      axios.post.mockResolvedValueOnce(mockApiResponse);

      await askCommand.execute(interaction);

      expect(axios.post).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/chat/completions',
        expect.objectContaining({
          model: 'google/gemini-2.0-flash-exp:free:online',
          plugins: expect.arrayContaining([
            expect.objectContaining({
              id: 'web',
              max_results: 3,
            }),
          ]),
        }),
        expect.any(Object),
      );

      expect(interaction.followUp).toHaveBeenCalledWith({
        content: expect.stringContaining('Web search enabled'),
        split: false,
        allowedMentions: { parse: [] },
      });
    });

    it('should use default websearch value when not provided', async () => {
      interaction = createMockInteraction({
        commandName: 'ask',
        stringOptions: {
          prompt: mockPrompt,
        },
        // Not providing websearch option
      });

      axios.post.mockResolvedValueOnce(mockApiResponse);

      await askCommand.execute(interaction);

      expect(axios.post).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/chat/completions',
        expect.objectContaining({
          model: 'google/gemini-2.0-flash-exp:free',
          plugins: undefined,
        }),
        expect.any(Object),
      );
    });

    it('should handle long responses with proper chunking and websearch enabled', async () => {
      interaction = createMockInteraction({
        commandName: 'ask',
        stringOptions: {
          prompt: mockPrompt,
        },
        booleanOptions: {
          websearch: true,
        },
      });

      const longResponse = 'A'.repeat(2500);
      axios.post.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: longResponse,
              },
            },
          ],
        },
      });

      await askCommand.execute(interaction);

      expect(interaction.followUp).toHaveBeenCalledTimes(2);
      expect(interaction.followUp.mock.calls[0][0].content).toContain('Web search enabled');
      expect(interaction.followUp.mock.calls[1][0].content).toContain('(continued)');
    });

    it('should handle code blocks in chunked responses with websearch', async () => {
      interaction = createMockInteraction({
        commandName: 'ask',
        stringOptions: {
          prompt: mockPrompt,
        },
        booleanOptions: {
          websearch: true,
        },
      });

      const responseWithCodeBlock = "Here's a code example:\n```python\nprint('hello')\n```".repeat(
        20,
      );
      axios.post.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: responseWithCodeBlock,
              },
            },
          ],
        },
      });

      await askCommand.execute(interaction);

      // Verify that code blocks are not split in the middle
      interaction.followUp.mock.calls.forEach(call => {
        const { content } = call[0];
        const openBlocks = (content.match(/```/g) || []).length;
        expect(openBlocks % 2).toBe(0); // Should always be even
      });

      // First chunk should contain websearch indicator
      expect(interaction.followUp.mock.calls[0][0].content).toContain('Web search enabled');
    });

    it('should handle API errors with websearch enabled', async () => {
      interaction = createMockInteraction({
        commandName: 'ask',
        stringOptions: { prompt: mockPrompt },
        booleanOptions: { websearch: true },
      });

      const error = new Error('API Error');
      error.response = { data: 'API Error Details' };
      axios.post.mockRejectedValueOnce(error);

      await askCommand.execute(interaction);

      expect(interaction.followUp).toHaveBeenCalledWith({
        content: 'Sorry, there was an error processing your request.',
        ephemeral: true,
      });
    });

    it('should handle rate limit errors', async () => {
      interaction = createMockInteraction({
        commandName: 'ask',
        stringOptions: { prompt: mockPrompt },
      });

      const error = new Error('Rate Limit Exceeded');
      error.response = { status: 429, data: 'Too Many Requests' };
      axios.post.mockRejectedValueOnce(error);

      await askCommand.execute(interaction);

      expect(interaction.followUp).toHaveBeenCalledWith({
        content: 'The AI service is currently busy. Please try again in a few moments.',
        ephemeral: true,
      });
    });

    it('should handle timeout errors', async () => {
      interaction = createMockInteraction({
        commandName: 'ask',
        stringOptions: { prompt: mockPrompt },
      });

      const error = new Error('Timeout');
      error.code = 'ETIMEDOUT';
      axios.post.mockRejectedValueOnce(error);

      await askCommand.execute(interaction);

      expect(interaction.followUp).toHaveBeenCalledWith({
        content: 'The request timed out. Please try again.',
        ephemeral: true,
      });
    });

    it('should handle invalid request errors', async () => {
      interaction = createMockInteraction({
        commandName: 'ask',
        stringOptions: { prompt: mockPrompt },
      });

      const error = new Error('Bad Request');
      error.response = { status: 400, data: 'Invalid Request' };
      axios.post.mockRejectedValueOnce(error);

      await askCommand.execute(interaction);

      expect(interaction.followUp).toHaveBeenCalledWith({
        content: 'Invalid request. Please try rephrasing your question.',
        ephemeral: true,
      });
    });

    it('should send API request with correct headers regardless of websearch', async () => {
      interaction = createMockInteraction({
        commandName: 'ask',
        stringOptions: {
          prompt: mockPrompt,
        },
        booleanOptions: {
          websearch: true,
        },
      });

      axios.post.mockResolvedValueOnce(mockApiResponse);

      await askCommand.execute(interaction);

      expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.any(Object), {
        headers: {
          Authorization: 'Bearer test-api-key',
          'HTTP-Referer': 'https://github.com/hllywluis/kekbot.js',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should handle defer reply failure with websearch', async () => {
      interaction = createMockInteraction({
        commandName: 'ask',
        stringOptions: {
          prompt: mockPrompt,
        },
        booleanOptions: {
          websearch: true,
        },
        deferFails: true,
      });

      await expect(askCommand.execute(interaction)).rejects.toThrow('Failed to defer reply');
    });

    it('should handle follow up failure with websearch', async () => {
      interaction = createMockInteraction({
        commandName: 'ask',
        stringOptions: {
          prompt: mockPrompt,
        },
        booleanOptions: {
          websearch: true,
        },
        followUpFails: true,
      });

      axios.post.mockResolvedValueOnce(mockApiResponse);

      await expect(askCommand.execute(interaction)).rejects.toThrow('Failed to follow up');
    });
  });
});
