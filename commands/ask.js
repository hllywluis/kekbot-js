const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask a question to the AI')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Your question or prompt')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const prompt = interaction.options.getString('prompt');

        try {
            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                model: 'meta-llama/llama-3.2-3b-instruct',
                messages: [
                    { role: 'user', content: prompt }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'https://github.com/hllywluis/kekbot.js',
                    'Content-Type': 'application/json'
                }
            });

            const aiResponse = response.data.choices[0].message.content;
            const formattedResponse = `> **Question:** ${prompt}\n\n${aiResponse}`;

            if (formattedResponse.length <= 2000) {
                // Send as a single message with proper formatting
                await interaction.followUp({
                    content: formattedResponse,
                    split: false,
                    allowedMentions: { parse: [] }
                });
            } else {
                // For longer messages, split while preserving markdown
                const maxLength = 2000;
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
                        chunk = '(continued)\n' + chunk;
                    }

                    await interaction.followUp({
                        content: chunk,
                        split: false,
                        allowedMentions: { parse: [] }
                    });

                    remainingText = remainingText.slice(chunk.length);
                    isFirstChunk = false;
                }
            }

        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            await interaction.followUp({
                content: 'Sorry, there was an error processing your request.',
                ephemeral: true
            });
        }
    },
};