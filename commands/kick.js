// kick.js - Discord bot kick command
// Copyright (C) 2025  Luis Bauza
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Command from '../utils/Command.js';

export default class KickCommand extends Command {
  defineCommand() {
    return new SlashCommandBuilder()
      .setName('kick')
      .setDescription('Kick a user from the server')
      .addUserOption(option =>
        option.setName('target').setDescription('The user to kick').setRequired(true),
      )
      .addStringOption(option => option.setName('reason').setDescription('Reason for kicking'))
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);
  }

  async run(interaction) {
    const target = interaction.options.getMember('target');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) {
      throw new Error('That user is not in this server!');
    }

    if (!target.kickable) {
      throw new Error('I cannot kick this user! They may have higher permissions than me.');
    }

    await target.kick(reason);
    await interaction.reply({
      content: `Successfully kicked ${target.user.tag}\nReason: ${reason}`,
      ephemeral: true,
    });
  }
}
