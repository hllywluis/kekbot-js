// Mock Discord.js Client and other commonly used classes
jest.mock('discord.js', () => ({
    Client: jest.fn(() => ({
        login: jest.fn().mockResolvedValue('token'),
        destroy: jest.fn().mockResolvedValue(),
        on: jest.fn(),
        once: jest.fn(),
        user: {
            setActivity: jest.fn()
        }
    })),
    Collection: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        has: jest.fn(),
        delete: jest.fn()
    })),
    GatewayIntentBits: {
        Guilds: 1,
        GuildMessages: 2,
        MessageContent: 3
    },
    Events: {
        ClientReady: 'ready',
        InteractionCreate: 'interactionCreate'
    },
    SlashCommandBuilder: jest.fn().mockReturnValue({
        setName: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        addStringOption: jest.fn().mockReturnThis(),
        addIntegerOption: jest.fn().mockReturnThis(),
        addUserOption: jest.fn().mockReturnThis()
    })
}));

// Mock environment variables
process.env.DISCORD_TOKEN = 'mock-token';
process.env.CLIENT_ID = 'mock-client-id';
process.env.GUILD_ID = 'mock-guild-id';