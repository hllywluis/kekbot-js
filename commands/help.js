// help.js - Discord bot help command
// Copyright (C) 2025  Luis Bauza
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Command from '../utils/command.js';

export default class HelpCommand extends Command {
  defineCommand() {
    return new SlashCommandBuilder().setName('help').setDescription('Lists all available commands');
  }

  async run(interaction) {
    const { commands } = interaction.client;
    const helpEmbed = new EmbedBuilder()
      .setColor('#5dc67b')
      .setTitle('Available Commands')
      .setDescription('Here are all my commands:')
      .setTimestamp();

    commands.forEach(command => {
      helpEmbed.addFields({
        name: `/${command.data.name}`,
        value: command.data.description,
      });
    });

    await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
  }
}
