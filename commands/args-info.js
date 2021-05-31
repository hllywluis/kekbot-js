module.exports = {
    name: 'args-info',
    description: 'Parses information about provided arguments.',
    arguments: true,
    cooldown: 2,
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