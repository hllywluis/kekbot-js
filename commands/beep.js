module.exports = {
    name: 'beep',
    description: 'Sends a nice boop to the channel.',
    cooldown: 1,
    execute(message) {
        message.channel.send('Boop.');
    },
};