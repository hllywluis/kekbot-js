module.exports = {
    name: 'prune',
    description: 'Prunes up to 100 messages, or displays an error if I can\'t delete any.',
    cooldown: 20,
    arguments: true,
    execute(message, arguments) {
        let amount = parseInt(arguments[0] + 1);

        if (isNaN(amount)) {
            return message.reply(`${arguments[0]} isn\'t a valid number...`)
        } else if (amount < 1 || amount > 99) {
            return message.reply('You need to enter a number between 1 and 99.');
        }

        message.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            message.channel.send('There was an error in trying to prune messages from this channel.');
        });
    }
};