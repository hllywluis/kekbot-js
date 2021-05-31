module.exports = {
    name: 'args-info',
    description: 'Parses information about provided arguments.',
    arguments: true,
    cooldown: 2,
    execute(message, arguments) {
        if (arguments[0] === 'foo') {
            return message.channel.send('bar');
        }
        message.channel.send(`Arguments: ${arguments}\nArguments length: ${arguments.length}.`);
    },
};