module.exports = {
    name: 'server',
    description: 'Retrieves and sends server information to the channel.',
    execute(message) {
        message.channel.startTyping()
        message.channel.send(`This server's name is: ${message.guild.name}.\nTotal members: ${message.guild.memberCount}.`);
        message.channel.stopTyping()
    },
};