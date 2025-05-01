// ask.js - Discord bot AI question command
// Copyright (C) 2025  Luis Bauza
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import Command from '../utils/command.js';

const config = {
  webSearch: {
    enabled: false, // Default web search state
    allowOverride: true, // Whether users can override the default state
  },
};

export default class AskCommand extends Command {
  defineCommand() {
    return new SlashCommandBuilder()
      .setName('ask')
      .setDescription('Ask a question to the AI')
      .addStringOption(option =>
        option.setName('prompt').setDescription('Your question or prompt').setRequired(true),
      )
      .addBooleanOption(option =>
        option
          .setName('websearch')
          .setDescription('Enable web search for more up-to-date information')
          .setRequired(false),
      );
  }

  async run(interaction) {
    await interaction.deferReply();

    const prompt = interaction.options.getString('prompt');
    const userWebSearchOption = interaction.options.getBoolean('websearch');

    // Determine if web search should be enabled based on config and user option
    const webSearchEnabled =
      config.webSearch.allowOverride && userWebSearchOption !== null
        ? userWebSearchOption // Use user's choice if override is allowed and option was provided
        : config.webSearch.enabled; // Otherwise use default config

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: webSearchEnabled
          ? 'google/gemma-3-27b-it:free:online'
          : 'google/gemma-3-27b-it:free',
        messages: [
          {
            role: 'system',
            content:
              'You are kekbot, a highly celebrated and knowledgeable computer scientist with decades of experience in various fields of computing. You are known for your ability to explain complex topics in a clear, concise, and insightful manner. Provide direct and to-the-point answers, avoiding unnecessary elaboration or repetition. Focus on delivering accurate and valuable information efficiently.',
          },
          { role: 'user', content: prompt },
        ],
        plugins: webSearchEnabled
          ? [
              {
                id: 'web',
                max_results: 3,
                search_prompt:
                  `A web search was conducted on ${new Date().toISOString()}. ` +
                  'Incorporate the following web search results into your response. ' +
                  'IMPORTANT: Cite them using markdown links named using the domain of the source. ' +
                  'Example: [nytimes.com](https://nytimes.com/some-page).',
              },
            ]
          : undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://github.com/hllywluis/kekbot.js',
          'Content-Type': 'application/json',
        },
      },
    );

    const aiResponse = response.data.choices[0].message.content;
    const webSearchStatus = webSearchEnabled ? '\n> *Web search enabled* 🔍\n' : '';
    const formattedResponse = `> **Question:** ${prompt}${webSearchStatus}\n${aiResponse}`;

    if (formattedResponse.length <= 2000) {
      // Send as a single message with proper formatting
      await interaction.followUp({
        content: formattedResponse,
        split: false,
        allowedMentions: { parse: [] },
      });
    } else {
      // For longer messages, split while preserving markdown
      const maxLength = 2000;
      const chunks = [];
      let remainingText = formattedResponse;
      let isFirstChunk = true;

      while (remainingText.length > 0) {
        let chunk = remainingText.slice(0, maxLength);

        // If we're in the middle of a code block, find a safe split point
        const lastCodeBlock = chunk.lastIndexOf('```');
        if (lastCodeBlock !== -1 && !chunk.slice(lastCodeBlock).includes('\n```')) {
          // Find the last newline before maxLength
          const lastNewline = chunk.lastIndexOf('\n');
          if (lastNewline !== -1) {
            chunk = chunk.slice(0, lastNewline);
          }
        }

        // For subsequent chunks, add continuation indicator
        if (!isFirstChunk) {
          chunk = `(continued)\n${chunk}`;
        }

        chunks.push({
          content: chunk,
          split: false,
          allowedMentions: { parse: [] },
        });

        remainingText = remainingText.slice(chunk.length);
        isFirstChunk = false;
      }

      // Send chunks sequentially using reduce
      await chunks.reduce(
        (promise, chunk) =>
          promise.then(async () => {
            await interaction.followUp(chunk);
          }),
        Promise.resolve(),
      );
    }
  }

  getErrorMessage(error) {
    if (error.response?.status === 429) {
      return 'The AI service is currently busy. Please try again in a few moments.';
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'The request timed out. Please try again.';
    }
    if (error.response?.status === 400) {
      return 'Invalid request. Please try rephrasing your question.';
    }
    return 'Sorry, there was an error processing your request.';
  }
}
