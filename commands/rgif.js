const d = require('discord.js')
const Tenor = require('tenorjs').client({
    'Key': 'UKVLOBC3HII5',
    'Filter': 'off',
    'Locale': 'en_US',
    'MediaFilter': 'minimal',
    'DateFormat': 'MM/DD/YYYY - H:mm:ss A'
})

module.exports = {
    name: 'Random GIF (NSFW)',
    description: 'Sends a random GIF relating to a specified search term.',
    aliases: ['rg'],
    usage: '~rg [search term]',
    cooldown: 1,
    guildOnly: false,
    execute(message) {
        let searchTerm = message.content.substr(3).trim()
        Tenor.Search.Random(searchTerm, '1').then(results => {
            let tenorEmbed = new d.MessageEmbed()
                .setColor('#307ad6')
                .setAuthor('Tenor', 'https://tenor.com/assets/img/tenor-app-icon.png', results[0].itemurl)
                .setTitle(searchTerm)
                .setImage(results[0].media[0].gif.url)

            message.channel.send(tenorEmbed)
        })
    }
}