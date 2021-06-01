const d = require('discord.js')
const translate = require('@iamtraction/google-translate')

module.exports = {
    name: 'Translate',
    description: 'Translate words/sentences into other languages using Google Translate.',
    aliases: ['tr'],
    usage: '~tr [language] [text]',
    cooldown: 2,
    arguments: true,
    guildOnly: false,
    execute(message, arguments) {
        message.channel.startTyping()

        let trString = "";
        for (let i = 1; i < arguments.length; i++) {
            if (i === arguments.length - 1) {
                trString += arguments[i]
            } else {
                trString += arguments[i] + " "
            }
        }
        let trLang = arguments[0]

        let languageNames = new Intl.DisplayNames(['en'], {type: 'language'})

        translate(trString, { to: trLang }).then(function (res) {
            const translationEmbed = new d.MessageEmbed()
                .setColor('#1a73e8')
                .setAuthor('Google Translate', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/1024px-Google_Translate_logo.svg.png', encodeURI('https://translate.google.com/?sl=' + res.from.language.iso + '&tl=' + trLang + '&text=' + trString + '&op=translate'))
                .addField(languageNames.of(res.from.language.iso) + ':', trString)
                .addField(languageNames.of(trLang) + ':', res.text)

            message.channel.send(translationEmbed)
            message.channel.stopTyping()
        })
    },
};