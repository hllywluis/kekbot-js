// ping.js - Discord bot ping command
// Copyright (C) 2025  Luis Bauza
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { SlashCommandBuilder } from 'discord.js';
import Command from '../utils/command.js';

export default class PingCommand extends Command {
  defineCommand() {
    return new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');
  }

  async run(interaction) {
    await interaction.reply('Pong! 🏓');
  }
}
