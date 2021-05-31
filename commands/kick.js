module.exports = {
    name: 'kick',
    aliases: ['remove'],
    description: 'Doesn\'t actually kick anyone, just broadcasts your intention to the channel.',
    guildOnly: true,
    cooldown: 8,
    execute(message) {
        message.channel.startTyping()
        if (!message.mentions.users.size) {
            message.channel.stopTyping()
            return message.reply('please tag a user.')
        }

        let taggedUser = message.mentions.users.first()

        if (taggedUser.id === '625855286783115294') {
            message.channel.stopTyping()
            return message.channel.send('You wanted to kick me?!?!')
        }
        message.channel.send(`You wanted to kick: ${taggedUser.username}`)
        message.channel.stopTyping()
    },
};