const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'List all commands or information on a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, arguments) {
        const data = [];
        const { commands } = message.client;

        if (!arguments.length) {
            data.push('Here\'s a list of all of my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get information on a specific command.`);

            return message.author.send(data, { split: true})
                .then(() => {
                    if (message.channel.type === 'dm') { return; }
                    message.reply('I\'ve sent you a DM with all of my commands!');
                }).catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag},\n`, error);
                    message.reply('It seems like I can\'t DM you! Do you have your DMs disabled?');
                })
        }

        const name = arguments[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`Name: ${command.name}`);

        if (command.aliases) { data.push(`Aliases: ${command.aliases.join(', ')}`); }
        if (command.description) { data.push(`Description: ${command.description}`); }
        if (command.usage) { data.push(`Usage: ${prefix}${command.name} ${command.usage}`); }

        data.push(`Cooldown: ${command.cooldown || 3} second(s).`);

        message.channel.send(data, { split: true });
    }
};