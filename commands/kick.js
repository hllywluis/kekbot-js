// kick.js - Discord bot kick command
// Copyright (C) 2025  Luis Bauza
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('The user to kick')
        .setRequired(true),
    )
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for kicking'),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const target = interaction.options.getMember('target');
    const reason =
      interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) {
      return interaction.reply({
        content: 'That user is not in this server!',
        ephemeral: true,
      });
    }

    if (!target.kickable) {
      return interaction.reply({
        content:
          'I cannot kick this user! They may have higher permissions than me.',
        ephemeral: true,
      });
    }

    try {
      await target.kick(reason);
      await interaction.reply({
        content: `Successfully kicked ${target.user.tag}\nReason: ${reason}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error trying to kick this user!',
        ephemeral: true,
      });
    }
  },
};
