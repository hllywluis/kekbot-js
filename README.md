# Kekbot.js

A simple Discord bot with essential moderation and utility commands.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

Copyright (C) 2025  Luis Bauza

This program comes with ABSOLUTELY NO WARRANTY; for details see the LICENSE file.
This is free software, and you are welcome to redistribute it
under certain conditions described in the license.

## Features

- Modern Discord.js v14 implementation
- Slash commands for better user experience
- Essential moderation commands (kick, prune)
- AI-powered question answering with optional web search capability
- Help command for easy reference

## Commands

- `/help` - Lists all available commands
- `/ping` - Check if the bot is responsive
- `/kick` - Kick a user from the server (requires Kick Members permission)
- `/prune` - Delete up to 99 messages (requires Manage Messages permission)
- `/ask` - Ask a question to the AI (supports optional web search for up-to-date information)

## Setup

1. Create a `.env` file with your bot token and client ID:

```
DISCORD_TOKEN=your_token_here
CLIENT_ID=your_client_id_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

2. Install dependencies:

```bash
npm install
```

3. Deploy slash commands:

```bash
npm run deploy
```

4. Start the bot:

```bash
npm start
```

## Requirements

- Node.js 16.9.0 or higher
- Discord.js v14
- A Discord bot token and application ID
