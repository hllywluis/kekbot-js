const { createMockInteraction, createMockClient } = require('./testUtils');

describe('Test Utilities', () => {
  describe('createMockInteraction', () => {
    it('should create a mock interaction with default values', () => {
      const interaction = createMockInteraction();

      expect(interaction.commandName).toBe('test-command');
      expect(interaction.user.id).toBe('mock-user-id');
      expect(interaction.guild.id).toBe('mock-guild-id');
      expect(interaction.channel.id).toBe('mock-channel-id');
      expect(typeof interaction.reply).toBe('function');
      expect(typeof interaction.deferReply).toBe('function');
      expect(typeof interaction.editReply).toBe('function');
      expect(typeof interaction.followUp).toBe('function');
    });

    it('should create a mock interaction with custom values', () => {
      const customOptions = {
        commandName: 'custom-command',
        userId: 'custom-user-id',
        username: 'CustomUser',
        guildId: 'custom-guild-id',
        channelId: 'custom-channel-id',
      };

      const interaction = createMockInteraction(customOptions);

      expect(interaction.commandName).toBe('custom-command');
      expect(interaction.user.id).toBe('custom-user-id');
      expect(interaction.user.username).toBe('CustomUser');
      expect(interaction.guild.id).toBe('custom-guild-id');
      expect(interaction.channel.id).toBe('custom-channel-id');
    });
  });

  describe('createMockClient', () => {
    it('should create a mock client with default values', () => {
      const client = createMockClient();

      expect(client.user.id).toBe('mock-client-id');
      expect(client.user.username).toBe('MockBot');
      expect(typeof client.login).toBe('function');
      expect(typeof client.destroy).toBe('function');
      expect(typeof client.on).toBe('function');
      expect(typeof client.once).toBe('function');
    });

    it('should create a mock client with custom values', () => {
      const customOptions = {
        clientId: 'custom-client-id',
        clientUsername: 'CustomBot',
      };

      const client = createMockClient(customOptions);

      expect(client.user.id).toBe('custom-client-id');
      expect(client.user.username).toBe('CustomBot');
    });
  });
});
