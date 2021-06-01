module.exports = {
    name: 'Prune',
    description: 'Prunes up to 100 messages, or displays an error if I can\'t delete any.',
    usage: '~pr [number]',
    aliases: ['pr'],
    cooldown: 20,
    arguments: true,
    guildOnly: true,
    execute(message, arguments) {
        message.channel.startTyping()

        let amount = parseInt(arguments[0] + 1);

        if (isNaN(amount)) {
            message.channel.stopTyping()
            return message.reply(`${arguments[0]} isn\'t a valid number...`)
        } else if (amount < 1 || amount > 99) {
            message.channel.stopTyping()
            return message.reply('You need to enter a number between 1 and 99.');
        }

        message.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            message.channel.send('There was an error in trying to prune messages from this channel.');
            message.channel.stopTyping()
        });
    }
};