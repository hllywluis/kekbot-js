module.exports = {
    name: 'Ping',
    description: 'Sends a nice pong to the channel.',
    usage: '~ping',
    aliases: ['ping'],
    cooldown: 1,
    guildOnly: false,
    execute(message) {
        message.channel.startTyping()
        message.channel.send('Pong.');
        message.channel.stopTyping()
    },
};