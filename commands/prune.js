// prune.js - Discord bot message pruning command
// Copyright (C) 2025  Luis Bauza
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Command from '../utils/command.js';

export default class PruneCommand extends Command {
  defineCommand() {
    return new SlashCommandBuilder()
      .setName('prune')
      .setDescription('Prune up to 99 messages.')
      .addIntegerOption(option =>
        option
          .setName('amount')
          .setDescription('Number of messages to prune')
          .setMinValue(1)
          .setMaxValue(99)
          .setRequired(true),
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
  }

  async run(interaction) {
    const amount = interaction.options.getInteger('amount');
    const deleted = await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({
      content: `Successfully deleted ${deleted.size} message(s).`,
      ephemeral: true,
    });
  }
}
