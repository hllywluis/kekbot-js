const d = require('discord.js')
const ud = require('urban-dictionary')

module.exports = {
    name: 'Urban Dictionary',
    description: 'Send the definition of a word according to Urban Dictionary.',
    aliases: ['ud'],
    usage: '~ud [word]',
    cooldown: 1,
    guildOnly: false,
    execute(message) {
        message.channel.startTyping()

        let word = message.content.substr(3).trim()
        let words = word.split(' ')

        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1)
        }

        word = words.join(' ')

        ud.define(word, function (err, def) {
            if (err) {
                message.channel.send('An error occurred while looking up this word.')
                message.channel.stopTyping()
            } else {
                if (def) {
                    const dictionaryEmbed = new d.MessageEmbed()
                        .setColor('#e963a2')
                        .setTitle(word)
                        .setURL(encodeURI('https://www.urbandictionary.com/define.php?term=' + word))
                        .setAuthor('Urban Dictionary', 'https://apprecs.org/ios/images/app-icons/256/74/584986228.jpg', 'https://www.urbandictionary.com')
                        .addField('Definition by ' + def[0].author.replace(/\[/g, '').replace(/]/g, '') + ':', def[0].definition >= 1024 ? def[0].definition.replace(/\[/g, '').replace(/]/g, '').substr(0, 1021) + '...' : def[0].definition.replace(/\[/g, '').replace(/]/g, ''))
                        .addField('Example:', def[0].example >= 1024 ? def[0].example.replace(/\[/g, '').replace(/]/g, '').substr(0, 1021) + '...' : def[0].example.replace(/\[/g, '').replace(/]/g, ''))
                        .addField('Thumbs Up:', def[0].thumbs_up, true)
                        .addField('Thumbs Down:', def[0].thumbs_down, true)

                    message.channel.send(dictionaryEmbed)
                    message.channel.stopTyping()
                } else {
                    message.channel.send('No definition available.')
                    message.channel.stopTyping()
                }
            }
        })
    }
}