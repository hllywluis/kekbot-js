const { createMockInteraction } = require('../utils/testUtils');

// Mock the discord.js module
jest.mock('discord.js', () => ({
  SlashCommandBuilder: jest.fn().mockReturnValue({
    setName: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    addIntegerOption: jest.fn().mockImplementation(callback => {
      const option = {
        setName: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        setMinValue: jest.fn().mockReturnThis(),
        setMaxValue: jest.fn().mockReturnThis(),
        setRequired: jest.fn().mockReturnThis(),
      };
      callback(option);
      return {
        setDefaultMemberPermissions: jest.fn().mockReturnThis(),
        toJSON: jest.fn().mockReturnValue({
          name: 'prune',
          description: 'Prune up to 99 messages.',
          options: [
            {
              name: 'amount',
              description: 'Number of messages to prune',
              type: 4,
              required: true,
              min_value: 1,
              max_value: 99,
            },
          ],
        }),
      };
    }),
    toJSON: jest.fn(),
  }),
  PermissionFlagsBits: {
    ManageMessages: 0x2000n,
  },
}));

const pruneCommand = require('../../commands/prune');

describe('Prune Command', () => {
  describe('Command Structure', () => {
    it('should have correct name and description', () => {
      const commandData = pruneCommand.data.toJSON();
      expect(commandData.name).toBe('prune');
      expect(commandData.description).toBe('Prune up to 99 messages.');
    });

    it('should have required command properties', () => {
      expect(pruneCommand).toHaveProperty('data');
      expect(pruneCommand).toHaveProperty('execute');
      expect(typeof pruneCommand.execute).toBe('function');
    });

    it('should have correct option configuration', () => {
      const commandData = pruneCommand.data.toJSON();
      const option = commandData.options[0];

      expect(option.name).toBe('amount');
      expect(option.description).toBe('Number of messages to prune');
      expect(option.required).toBe(true);
      expect(option.min_value).toBe(1);
      expect(option.max_value).toBe(99);
    });
  });

  describe('Command Execution', () => {
    let interaction;
    const mockBulkDelete = jest.fn();

    beforeEach(() => {
      mockBulkDelete.mockReset();

      interaction = createMockInteraction({
        commandName: 'prune',
        integerOptions: {
          amount: 5,
        },
      });
      interaction.channel.bulkDelete = mockBulkDelete;
    });

    it('should successfully delete messages', async () => {
      mockBulkDelete.mockResolvedValueOnce({ size: 5 });

      await pruneCommand.execute(interaction);

      expect(mockBulkDelete).toHaveBeenCalledWith(5, true);
      expect(interaction.reply).toHaveBeenCalledWith({
        content: 'Successfully deleted 5 message(s).',
        ephemeral: true,
      });
    });

    it('should handle bulk delete failure', async () => {
      mockBulkDelete.mockRejectedValueOnce(
        new Error('Failed to delete messages'),
      );

      await pruneCommand.execute(interaction);

      expect(interaction.reply).toHaveBeenCalledWith({
        content: 'There was an error trying to prune messages in this channel!',
        ephemeral: true,
      });
    });

    it('should handle messages older than 14 days', async () => {
      mockBulkDelete.mockRejectedValueOnce(
        new Error('Messages older than 14 days cannot be deleted'),
      );

      await pruneCommand.execute(interaction);

      expect(interaction.reply).toHaveBeenCalledWith({
        content: 'There was an error trying to prune messages in this channel!',
        ephemeral: true,
      });
    });

    it('should handle interaction reply failure', async () => {
      mockBulkDelete.mockResolvedValueOnce({ size: 5 });
      interaction = createMockInteraction({
        commandName: 'prune',
        integerOptions: {
          amount: 5,
        },
        replyFails: true,
      });
      interaction.channel.bulkDelete = mockBulkDelete;

      await expect(pruneCommand.execute(interaction)).rejects.toThrow(
        'Failed to reply',
      );
    });
  });
});
