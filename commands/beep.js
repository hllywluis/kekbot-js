module.exports = {
    name: 'Beep',
    description: 'Sends a nice boop to the channel.',
    usage: '~beep',
    aliases: ['beep'],
    cooldown: 1,
    guildOnly: false,
    execute(message) {
        message.channel.startTyping()
        message.channel.send('Boop.')
        message.channel.stopTyping()
    },
};