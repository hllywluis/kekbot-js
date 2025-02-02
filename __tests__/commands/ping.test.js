const { createMockInteraction } = require('../utils/testUtils');

// Mock the discord.js module
jest.mock('discord.js', () => ({
  SlashCommandBuilder: jest.fn().mockReturnValue({
    setName: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    toJSON: jest.fn().mockReturnValue({
      name: 'ping',
      description: 'Replies with Pong!',
    }),
  }),
}));

const pingCommand = require('../../commands/ping');

describe('Ping Command', () => {
  describe('Command Structure', () => {
    it('should have correct name and description', () => {
      const commandData = pingCommand.data.toJSON();
      expect(commandData.name).toBe('ping');
      expect(commandData.description).toBe('Replies with Pong!');
    });

    it('should have required command properties', () => {
      expect(pingCommand).toHaveProperty('data');
      expect(pingCommand).toHaveProperty('execute');
      expect(typeof pingCommand.execute).toBe('function');
    });
  });

  describe('Command Execution', () => {
    let interaction;

    beforeEach(() => {
      interaction = createMockInteraction({
        commandName: 'ping',
      });
    });

    it('should reply with "Pong! 🏓"', async () => {
      await pingCommand.execute(interaction);

      expect(interaction.reply).toHaveBeenCalledTimes(1);
      expect(interaction.reply).toHaveBeenCalledWith('Pong! 🏓');
    });

    it('should handle interaction reply failure', async () => {
      // Mock a failed reply
      interaction.reply.mockRejectedValueOnce(new Error('Failed to reply'));

      await expect(pingCommand.execute(interaction)).rejects.toThrow(
        'Failed to reply',
      );
    });
  });
});
