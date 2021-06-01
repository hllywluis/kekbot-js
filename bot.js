const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();
const cleverbot = require('cleverbot-free')
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
});

client.on('message', message => {
    let chat = []
    if ((!message.content.startsWith(prefix) && message.channel.type === 'dm' && message.author.id !== client.user.id) || (!message.content.startsWith(prefix) && !message.mentions.has(message.mentions.EVERYONE_PATTERN) && message.mentions.has(client.user.id))) {
        message.channel.startTyping()
        let mention = /<@(.*?)>/

        if (chat.length > 5000) { chat = [] }
        chat.push(message.content.replace(mention, '').trim())
        cleverbot(message.content.replace(mention, '').trim(), chat).then(response => {
            const cleverbotEmbed = new Discord.MessageEmbed()
                .setColor('#cde9fa')
                .setAuthor('Cleverbot', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkVvqrpdE1ZWcLuucR507PvHXFQloeWO5mMR_2ZDGtj-j_aw8a2A6b4swH0c62E5lUSBA&usqp=CAU', 'https://cleverbot.com')

            cleverbotEmbed.addField(message.guild.member(message.author).displayName ? message.guild.member(message.author).displayName + ':' : message.author.username + ':', chat[0])
            cleverbotEmbed.addField('kekbot:', response)

            chat.push(response)
            // message.channel.send(response)
            message.channel.send(cleverbotEmbed)
        })

        message.channel.stopTyping()
    }

    if (!message.content.startsWith(prefix) || message.author.bot) { return; }

    const arguments = message.content.slice(prefix.length).split(/ +/);
    const commandName = arguments.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) { return; }

    if (message.channel.type === 'dm' && command.guildOnly && message.channel.type !== 'text') {
        message.channel.stopTyping()
        return message.reply('I can\'t execute that command inside DMs!');
    }

    // Checking and verifying arguments.
    if (command.arguments && !arguments.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${commandName} ${command.usage}.\``;
        }

        message.channel.stopTyping()
        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            message.channel.stopTyping()
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, arguments);
        message.channel.stopTyping()
    } catch (error) {
        console.error(error);
        message.channel.stopTyping()
        message.reply(`there was an error trying to execute ${commandName}.`);
    }
});

client.login(token);