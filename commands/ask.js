// ask.js - Discord bot AI question command
// Copyright (C) 2025  Luis Bauza
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';

const config = {
  webSearch: {
    enabled: false, // Default web search state
    allowOverride: true, // Whether users can override the default state
  },
};

export default {
  data: new SlashCommandBuilder()
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
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const prompt = interaction.options.getString('prompt');
    const userWebSearchOption = interaction.options.getBoolean('websearch');

    // Determine if web search should be enabled based on config and user option
    const webSearchEnabled =
      config.webSearch.allowOverride && userWebSearchOption !== null
        ? userWebSearchOption // Use user's choice if override is allowed and option was provided
        : config.webSearch.enabled; // Otherwise use default config

    try {
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
                'You are a helpful AI assistant. Provide clear, concise, and accurate responses. ' +
                'Keep your answers brief while ensuring they are informative and to the point. ' +
                'Avoid unnecessary elaboration or repetition. ',
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
              try {
                await interaction.followUp(chunk);
                return undefined;
              } catch (error) {
                console.error('Error sending message chunk:', {
                  chunkLength: chunk.content.length,
                  error: error.message,
                });
                // Attempt to send error notification
                try {
                  await interaction.followUp({
                    content: 'Failed to send complete response. Please try again.',
                    ephemeral: true,
                  });
                } catch (e) {
                  // If even the error notification fails, log it
                  console.error('Failed to send error notification:', e.message);
                }
                // Reject to stop processing remaining chunks
                return Promise.reject(error);
              }
            }),
          Promise.resolve(),
        );
      }
    } catch (error) {
      // Log detailed error information
      console.error('Error in ask command:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack,
      });

      // Provide more specific error messages to users
      let errorMessage = 'Sorry, there was an error processing your request.';
      if (error.response?.status === 429) {
        errorMessage = 'The AI service is currently busy. Please try again in a few moments.';
      } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        errorMessage = 'The request timed out. Please try again.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid request. Please try rephrasing your question.';
      }

      await interaction.followUp({
        content: errorMessage,
        ephemeral: true,
      });
    }
  },
};
