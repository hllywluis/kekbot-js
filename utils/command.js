// utils/Command.js - Base command class for Discord bot commands
// Copyright (C) 2025  Luis Bauza
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { SlashCommandBuilder } from 'discord.js';
import logger from '../logger.js';

export default class Command {
  constructor() {
    if (this.constructor === Command) {
      throw new Error('Abstract class Command cannot be instantiated');
    }

    this._data = this.defineCommand();
    this._logger = new logger(this.constructor.name);
  }

  get data() {
    return this._data;
  }

  // Abstract method - must be implemented by subclasses
  defineCommand() {
    throw new Error('Method defineCommand() must be implemented');
  }

  // Common execute method with standardized error handling
  async execute(interaction) {
    try {
      this._logger.info(`Executing command: ${interaction.commandName}`);
      await this.run(interaction);
    } catch (error) {
      this.handleError(interaction, error);
    }
  }

  // Abstract method - must be implemented by subclasses
  async run(interaction) {
    throw new Error('Method run() must be implemented');
  }

  // Standardized error handling
  handleError(interaction, error) {
    this._logger.error(`Command ${interaction.commandName} failed:`, error);

    const response = interaction.deferred ? 'followUp' : 'reply';
    const errorMessage = this.getErrorMessage(error);

    interaction[response]({
      content: errorMessage,
      ephemeral: true,
    });
  }

  // Customizable error message handling
  getErrorMessage(error) {
    if (error.response?.status === 429) {
      return 'The service is currently busy. Please try again later.';
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'The request timed out. Please try again.';
    }
    return `Command failed: ${error.message}`;
  }
}
