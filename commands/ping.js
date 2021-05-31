module.exports = {
    name: 'ping',
    description: 'Sends a nice pong to the channel.',
    cooldown: 1,
    execute(message) {
        message.channel.send('Pong.');
    },
};