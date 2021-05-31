const translate = require('@iamtraction/google-translate')

module.exports = {
    name: 'translate',
    description: 'Translate words/sentences into other languages.',
    aliases: ['tr'],
    usage: '~tr [language] [text]',
    cooldown: 2,
    arguments: true,
    execute(message, arguments) {
        let trString = "";
        for (let i = 1; i < arguments.length; i++) {
            if (i === arguments.length - 1) {
                trString += arguments[i]
            } else {
                trString += arguments[i] + " "
            }
        }
        let trLang = arguments[0]
        translate(trString, { to: trLang }).then(function (res) {
            console.log(res)
            message.channel.send(`The translation for \"${trString}\" in \`${trLang}\` is \"${res.text}\"`)
        })
    },
};