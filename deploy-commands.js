// deploy-commands.js - Discord bot command deployment
// Copyright (C) 2025  Luis Bauza
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import dotenv from 'dotenv';
import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// eslint-disable-next-line import/extensions
import Logger from './logger.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const logger = new Logger('deploy-commands');

const commands = [];
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

await Promise.all(
  commandFiles.map(async file => {
    const filePath = join(commandsPath, file);
    const command = await import(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    }
  }),
);

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    logger.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    logger.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    logger.error(error);
  }
})();
