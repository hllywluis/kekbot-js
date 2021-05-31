const d = require('discord.js')
const ud = require('urban-dictionary')

module.exports = {
    name: 'Urban Dictionary',
    description: 'Send the definition of a word according to Urban Dictionary.',
    aliases: ['ud'],
    usage: '[word]',
    cooldown: 1,
    execute(message) {
        let word = message.content.substr(3).trim()
        let words = word.split(' ')

        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1)
        }

        word = words.join(' ')

        ud.define(word, function (err, def) {
            if (err) {
                message.channel.send('An error occurred while looking up this word.')
                console.error(err)
            } else {
                if (def) {
                    const dictionaryEmbed = new d.MessageEmbed()
                        .setColor('#e963a2')
                        .setTitle(word)
                        .setURL('https://www.urbandictionary.com/define.php?term=' + word.replaceAll(' ', '%20'))
                        .setAuthor('Urban Dictionary', 'https://apprecs.org/ios/images/app-icons/256/74/584986228.jpg', 'https://www.urbandictionary.com')
                        .addField('Definition by ' + def[0].author.replaceAll('[', '').replaceAll(']', '') + ':', def[0].definition.replaceAll('[', '').replaceAll(']', ''))
                        .addField('Example:', def[0].example.replaceAll('[', '').replaceAll(']', ''))
                        .addField('Thumbs Up', def[0].thumbs_up, true)
                        .addField('Thumbs Down', def[0].thumbs_down, true)

                    message.channel.send(dictionaryEmbed)

                    console.log(def)
                } else {
                    message.channel.send('No definition available.')
                }
            }
        })
    }
}