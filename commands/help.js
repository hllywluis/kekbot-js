const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'List all commands or information on a specific command.',
    aliases: ['commands'],
    usage: '~help (command name)',
    cooldown: 5,
    execute(message, arguments) {
        message.channel.startTyping()

        const data = [];
        const { commands } = message.client;

        if (!arguments.length) {
            data.push('Here\'s a list of all of my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help (command name)\` to get information on a specific command.`);

            return message.author.send(data, { split: true})
                .then(() => {
                    if (message.channel.type === 'dm') { return; }
                    message.reply('I\'ve sent you a DM with all of my commands!');
                    message.channel.stopTyping()
                }).catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag},\n`, error);
                    message.reply('It seems like I can\'t DM you! Do you have your DMs disabled?');
                    message.channel.stopTyping()
                })
        }

        const name = arguments[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            message.channel.stopTyping()
            return message.reply('that\'s not a valid command!');
        }

        data.push(`Name: ${command.name}`);

        if (command.aliases) { data.push(`Aliases: ${command.aliases.join(', ')}`); }
        if (command.description) { data.push(`Description: ${command.description}`); }
        if (command.usage) { data.push(`Usage: ${prefix}${command.name} ${command.usage}`); }

        data.push(`Cooldown: ${command.cooldown || 3} second(s).`);

        message.channel.send(data, { split: true });
        message.channel.stopTyping()
    }
};