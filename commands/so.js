const d = require('discord.js')
const se = require('stackexchange')

module.exports = {
    name: 'Stack Overflow',
    description: 'Ask Mr. Stack Overflow a programming question.',
    aliases: ['so'],
    usage: '~so [query]',
    cooldown: 1,
    guildOnly: false,
    async execute(message) {
        const settings = { version: 2.3 }
        const so = new se(settings)

        const filter = {
            key: 'KQ6twtmhxNX4fYQZTL67gg((',
            pagesize: 1,
            intitle: 'use javascript filter function',
            sort: 'activity',
            order: 'desc',
            site: 'stackoverflow'
        }

        so.search.search(filter, (err, results) => {
            if (err) {
                throw err
            }

            console.log(results.items)
            console.log(results.has_more)
        })

        let stackoverflowEmbed = new d.MessageEmbed()
            .setTitle('Stack Overflow')
            .setColor('#ef712f')
            .setDescription('Stack Overflow Result')

        await message.channel.send(stackoverflowEmbed)
    }
}