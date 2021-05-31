module.exports = {
    name: 'kick',
    aliases: ['remove'],
    description: 'Doesn\'t actually kick anyone, just broadcasts your intention to the channel.',
    guildOnly: true,
    cooldown: 8,
    execute(message) {
        if (!message.mentions.users.size) {
            return message.reply('please tag a user.');
        }

        let taggedUser = message.mentions.users.first();

        if (taggedUser.id === '625855286783115294') {
            return message.channel.send('You wanted to kick me?!?!');
        }
        message.channel.send(`You wanted to kick: ${taggedUser.username}`);
    },
};