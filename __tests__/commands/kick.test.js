const { createMockInteraction } = require('../utils/testUtils');

// Mock the discord.js module
jest.mock('discord.js', () => ({
  SlashCommandBuilder: jest.fn().mockReturnValue({
    setName: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    addUserOption: jest.fn().mockImplementation(callback => {
      const option = {
        setName: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        setRequired: jest.fn().mockReturnThis(),
      };
      callback(option);
      return {
        addStringOption: jest.fn().mockImplementation(callback => {
          const option = {
            setName: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
          };
          callback(option);
          return {
            setDefaultMemberPermissions: jest.fn().mockReturnThis(),
            toJSON: jest.fn().mockReturnValue({
              name: 'kick',
              description: 'Kick a user from the server',
              options: [
                {
                  name: 'target',
                  description: 'The user to kick',
                  type: 6,
                  required: true,
                },
                {
                  name: 'reason',
                  description: 'Reason for kicking',
                  type: 3,
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
  PermissionFlagsBits: {
    KickMembers: 0x2n,
  },
}));

const kickCommand = require('../../commands/kick');

describe('Kick Command', () => {
  describe('Command Structure', () => {
    it('should have correct name and description', () => {
      const commandData = kickCommand.data.toJSON();
      expect(commandData.name).toBe('kick');
      expect(commandData.description).toBe('Kick a user from the server');
    });

    it('should have required command properties', () => {
      expect(kickCommand).toHaveProperty('data');
      expect(kickCommand).toHaveProperty('execute');
      expect(typeof kickCommand.execute).toBe('function');
    });

    it('should have correct option configuration', () => {
      const commandData = kickCommand.data.toJSON();
      const [targetOption, reasonOption] = commandData.options;

      expect(targetOption.name).toBe('target');
      expect(targetOption.description).toBe('The user to kick');
      expect(targetOption.required).toBe(true);

      expect(reasonOption.name).toBe('reason');
      expect(reasonOption.description).toBe('Reason for kicking');
      expect(reasonOption.required).toBe(false);
    });
  });

  describe('Command Execution', () => {
    let interaction;
    const mockKick = jest.fn();

    beforeEach(() => {
      mockKick.mockReset();

      const mockTarget = {
        kickable: true,
        kick: mockKick,
        user: {
          tag: 'TestUser#1234',
        },
      };

      interaction = createMockInteraction({
        commandName: 'kick',
        memberOptions: {
          target: mockTarget,
        },
        stringOptions: {
          reason: 'Test reason',
        },
      });
    });

    it('should successfully kick a user with reason', async () => {
      await kickCommand.execute(interaction);

      expect(mockKick).toHaveBeenCalledWith('Test reason');
      expect(interaction.reply).toHaveBeenCalledWith({
        content: expect.stringContaining('Successfully kicked TestUser#1234'),
        ephemeral: true,
      });
    });

    it('should use default reason when none provided', async () => {
      interaction = createMockInteraction({
        commandName: 'kick',
        memberOptions: {
          target: {
            kickable: true,
            kick: mockKick,
            user: { tag: 'TestUser#1234' },
          },
        },
        stringOptions: {
          reason: null,
        },
      });

      await kickCommand.execute(interaction);

      expect(mockKick).toHaveBeenCalledWith('No reason provided');
      expect(interaction.reply).toHaveBeenCalledWith({
        content: expect.stringContaining('No reason provided'),
        ephemeral: true,
      });
    });

    it('should handle non-existent target', async () => {
      interaction = createMockInteraction({
        commandName: 'kick',
        memberOptions: {
          target: null,
        },
      });

      await kickCommand.execute(interaction);

      expect(mockKick).not.toHaveBeenCalled();
      expect(interaction.reply).toHaveBeenCalledWith({
        content: 'That user is not in this server!',
        ephemeral: true,
      });
    });

    it('should handle non-kickable target', async () => {
      interaction = createMockInteraction({
        commandName: 'kick',
        memberOptions: {
          target: {
            kickable: false,
            user: { tag: 'Admin#1234' },
          },
        },
      });

      await kickCommand.execute(interaction);

      expect(mockKick).not.toHaveBeenCalled();
      expect(interaction.reply).toHaveBeenCalledWith({
        content:
          'I cannot kick this user! They may have higher permissions than me.',
        ephemeral: true,
      });
    });

    it('should handle kick failure', async () => {
      const mockTarget = {
        kickable: true,
        kick: jest.fn().mockRejectedValueOnce(new Error('Failed to kick user')),
        user: { tag: 'TestUser#1234' },
      };

      interaction = createMockInteraction({
        commandName: 'kick',
        memberOptions: {
          target: mockTarget,
        },
      });

      await kickCommand.execute(interaction);

      expect(interaction.reply).toHaveBeenCalledWith({
        content: 'There was an error trying to kick this user!',
        ephemeral: true,
      });
    });

    it('should handle interaction reply failure', async () => {
      interaction = createMockInteraction({
        commandName: 'kick',
        memberOptions: {
          target: {
            kickable: true,
            kick: mockKick,
            user: { tag: 'TestUser#1234' },
          },
        },
        replyFails: true,
      });

      await expect(kickCommand.execute(interaction)).rejects.toThrow(
        'Failed to reply',
      );
    });
  });
});
