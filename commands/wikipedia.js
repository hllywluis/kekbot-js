const d = require('discord.js')
const wiki = require('wikipedia')

module.exports = {
    name: 'Wikipedia',
    description: 'Search Wikipedia for a specific article.',
    aliases: ['wk'],
    usage: '~wk [query]',
    cooldown: 1,
    guildOnly: false,
    async execute(message) {
        try {
            let result = await wiki.page(message.content.substr(3).trim())
            let summary = await result.summary()

            let wikipediaEmbed = new d.MessageEmbed()
                .setTitle(result.title)
                .setColor('#ebebeb')
                .setDescription(summary.description)
                .setAuthor('Wikipedia', 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1920px-Wikipedia-logo-v2.svg.png', 'https://www.wikipedia.org')
                .setURL(result.fullurl)
                .addField('Summary:', summary.extract)
                .setThumbnail(summary.originalimage ? summary.originalimage.source : '')

            await message.channel.send(wikipediaEmbed)
        } catch(error) {
            let wikipediaErrorEmbed = new d.MessageEmbed()
                .setTitle(message.content.substr(3).trim())
                .setColor('#ff0000')
                .setDescription('Not found')
                .setURL(encodeURI('https://www.wikipedia.org/wiki/' + message.content.substr(3).trim()))
                .setAuthor('Wikipedia', 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1920px-Wikipedia-logo-v2.svg.png', 'https://www.wikipedia.org')
                .addField('Sorry!', 'I couldn\'t find any results for `' + message.content.substr(3).trim() + '`.\nI\'ve provided a link above to check.')

            await message.channel.send(wikipediaErrorEmbed)
        }
    }
}