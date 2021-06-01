module.exports = {
    name: 'Server',
    description: 'Retrieves and sends server information to the channel.',
    usage: '~sv',
    aliases: ['sv'],
    guildOnly: true,
    execute(message) {
        message.channel.startTyping()
        message.channel.send(`This server's name is: ${message.guild.name}.\nTotal members: ${message.guild.memberCount}.`);
        message.channel.stopTyping()
    },
};