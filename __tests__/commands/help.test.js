const { createMockInteraction } = require('../utils/testUtils');

// Mock the discord.js module
jest.mock('discord.js', () => ({
  SlashCommandBuilder: jest.fn().mockReturnValue({
    setName: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    toJSON: jest.fn().mockReturnValue({
      name: 'help',
      description: 'Lists all available commands',
    }),
  }),
  EmbedBuilder: jest.fn().mockReturnValue({
    setColor: jest.fn().mockReturnThis(),
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setTimestamp: jest.fn().mockReturnThis(),
    addFields: jest.fn().mockReturnThis(),
  }),
}));

const helpCommand = require('../../commands/help');

describe('Help Command', () => {
  describe('Command Structure', () => {
    it('should have correct name and description', () => {
      const commandData = helpCommand.data.toJSON();
      expect(commandData.name).toBe('help');
      expect(commandData.description).toBe('Lists all available commands');
    });

    it('should have required command properties', () => {
      expect(helpCommand).toHaveProperty('data');
      expect(helpCommand).toHaveProperty('execute');
      expect(typeof helpCommand.execute).toBe('function');
    });
  });

  describe('Command Execution', () => {
    let interaction;
    const mockCommands = new Map([
      ['ping', { data: { name: 'ping', description: 'Replies with Pong!' } }],
      [
        'help',
        { data: { name: 'help', description: 'Lists all available commands' } },
      ],
    ]);

    beforeEach(() => {
      interaction = createMockInteraction({
        commandName: 'help',
      });
      interaction.client.commands = mockCommands;
    });

    it('should create an embed with all commands', async () => {
      await helpCommand.execute(interaction);

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.arrayContaining([expect.any(Object)]),
          ephemeral: true,
        })
      );
    });

    it('should handle empty commands collection', async () => {
      interaction.client.commands = new Map();
      await helpCommand.execute(interaction);

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.arrayContaining([expect.any(Object)]),
          ephemeral: true,
        })
      );
    });

    it('should handle interaction reply failure', async () => {
      interaction = createMockInteraction({
        commandName: 'help',
        replyFails: true,
      });
      interaction.client.commands = mockCommands;

      await expect(helpCommand.execute(interaction)).rejects.toThrow(
        'Failed to reply',
      );
    });

    it('should create embed with correct structure', async () => {
      const { EmbedBuilder } = require('discord.js');
      await helpCommand.execute(interaction);

      const embedInstance = EmbedBuilder.mock.results[0].value;

      expect(embedInstance.setColor).toHaveBeenCalledWith('#5dc67b');
      expect(embedInstance.setTitle).toHaveBeenCalledWith('Available Commands');
      expect(embedInstance.setDescription).toHaveBeenCalledWith(
        'Here are all my commands:',
      );
      expect(embedInstance.setTimestamp).toHaveBeenCalled();
      expect(embedInstance.addFields).toHaveBeenCalledTimes(mockCommands.size);
    });
  });
});
