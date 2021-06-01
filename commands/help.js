const d = require('discord.js')

module.exports = {
    name: 'Help',
    description: 'List all commands or information on a specific command.',
    aliases: ['help', 'cmds', 'cmd', 'commands', 'hlp'],
    usage: '~help (command name)',
    cooldown: 5,
    guildOnly: false,
    execute(message, arguments) {
        message.channel.startTyping(1)

        let commandData = []
        const { commands } = message.client

        if (!arguments.length) {
            commands.map(command => {
                commandData.push(('・' + command.name + ' - `' + command.aliases + '` ' + ' - ' + command.description).replace(/,/g, ', '))
            })

            const helpEmbed = new d.MessageEmbed()
                .setColor('#5dc67b')
                .setTitle('Help is here.')
                .setAuthor('kekbot', 'https://cdn.discordapp.com/app-icons/625855286783115294/fe19dc5ce35a3aad25066b76b9318211.png?size=512')
                .addField('Commands:', commandData.join('\n'))
                .addField('PSST:', 'You can send `~help (command)` for more information on a specific command.', true)
                .addField('Total Number:', commandData.length, true)

            return message.author.send(helpEmbed)
                .then(() => {
                    if (message.channel.type === 'dm') { return; }
                    message.reply('I\'ve sent you a DM with all of my commands!')
                    message.channel.stopTyping()
                }).catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag},\n`, error)
                    message.reply('It seems like I can\'t DM you! Do you have your DMs disabled?')
                    message.channel.stopTyping()
                })
        }

        const name = arguments[0].toLowerCase()
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))

        if (!command) {
            message.channel.stopTyping()
            return message.reply('That\'s not a valid command.')
        }

        const commandEmbed = new d.MessageEmbed()
            .setColor('#5dc67b')
            .setTitle(command.name.trim())
            .setAuthor('kekbot', 'https://cdn.discordapp.com/app-icons/625855286783115294/fe19dc5ce35a3aad25066b76b9318211.png?size=512')
            .addField('Description:', command.description.trim())
            .addField('Usage:', '`' + command.usage.trim() + '`')
            .addField('Aliases:', ('' + command.aliases).replace(/,/g, ', ').trim())
            .addField('Cooldown:', command.cooldown + ' second(s)')

        message.channel.send(commandEmbed)
        message.channel.stopTyping()
    }
};