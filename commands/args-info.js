module.exports = {
    name: 'Argument Info',
    description: 'Parses information about provided arguments.',
    usage: '~arg (arguments...)',
    aliases: ['arg'],
    cooldown: 2,
    arguments: true,
    guildOnly: false,
    execute(message, arguments) {
        message.channel.startTyping()

        if (arguments[0] === 'foo') {
            message.channel.stopTyping()
            return message.channel.send('bar');
        }
        message.channel.send(`Arguments: ${arguments}\nArguments length: ${arguments.length}.`);
        message.channel.stopTyping()
    },
};