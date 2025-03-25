// bot.js - Discord bot for moderation and utilities
// Copyright (C) 2025  Luis Bauza
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import Logger from './logger.js';
import { loadCommands } from './utils/commandLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = new Logger('bot');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');

const commands = await loadCommands(commandsPath, logger);
commands.forEach(command => {
  client.commands.set(command.data.name, command);
});

client.once(Events.ClientReady, () => {
  logger.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    logger.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    // Log detailed error context
    logger.error(
      `Command "${interaction.commandName}" failed for user ${interaction.user.tag}:`,
      error,
    );

    // Prepare error response
    const isProduction = process.env.NODE_ENV === 'production';
    const errorMessage = isProduction
      ? `❌ Command failed. Please try again later.`
      : `❌ Command failed: ${error.message}\n\n${error.stack}`;

    const responseMethod = interaction.replied || interaction.deferred ? 'followUp' : 'reply';

    await interaction[responseMethod]({
      content: errorMessage,
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
