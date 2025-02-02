// Test utilities for Discord.js bot testing

/**
 * Creates a mock interaction object with common properties and methods
 * @param {Object} options - Customization options for the mock interaction
 * @returns {Object} Mock interaction object
 */
const createMockInteraction = (options = {}) => ({
  commandName: options.commandName || 'test-command',
  user: {
    id: options.userId || 'mock-user-id',
    username: options.username || 'MockUser',
    tag: options.userTag || 'MockUser#0000',
  },
  guild: {
    id: options.guildId || 'mock-guild-id',
    name: options.guildName || 'Mock Guild',
  },
  channel: {
    id: options.channelId || 'mock-channel-id',
    name: options.channelName || 'mock-channel',
    send: jest.fn().mockResolvedValue({ id: 'mock-message-id' }),
    bulkDelete: jest.fn().mockResolvedValue({ size: 0 }),
  },
  client: {
    commands: new Map(),
    user: {
      id: 'mock-client-id',
      username: 'MockBot',
      setActivity: jest.fn(),
    },
  },
  reply: jest.fn().mockImplementation(async _response => {
    if (options.replyFails) {
      throw new Error('Failed to reply');
    }
    return { id: 'mock-reply-id' };
  }),
  deferReply: jest.fn().mockImplementation(async () => {
    if (options.deferFails) {
      throw new Error('Failed to defer reply');
    }
    return true;
  }),
  editReply: jest.fn().mockResolvedValue({ id: 'mock-edit-id' }),
  followUp: jest.fn().mockImplementation(async _response => {
    if (options.followUpFails) {
      throw new Error('Failed to follow up');
    }
    return { id: 'mock-followup-id' };
  }),
  options: {
    getString: jest.fn(name => options.stringOptions?.[name]),
    getInteger: jest.fn(name => options.integerOptions?.[name]),
    getBoolean: jest.fn(name => options.booleanOptions?.[name]),
    getUser: jest.fn(name => options.userOptions?.[name]),
    getMember: jest.fn(name => options.memberOptions?.[name]),
    get: jest.fn(name => options.options?.[name]),
  },
  member: {
    permissions: {
      has: jest.fn().mockReturnValue(options.hasPermission ?? true),
    },
    roles: {
      cache: new Map(),
    },
  },
  isCommand: () => true,
  isChatInputCommand: () => true,
});

/**
 * Creates a mock client object with common properties and methods
 * @param {Object} options - Customization options for the mock client
 * @returns {Object} Mock client object
 */
const createMockClient = (options = {}) => ({
  user: {
    id: options.clientId || 'mock-client-id',
    username: options.clientUsername || 'MockBot',
    setActivity: jest.fn(),
  },
  guilds: {
    cache: new Map(),
  },
  commands: new Map(),
  on: jest.fn(),
  once: jest.fn(),
  login: jest.fn().mockResolvedValue('token'),
  destroy: jest.fn().mockResolvedValue(),
});

module.exports = {
  createMockInteraction,
  createMockClient,
};
