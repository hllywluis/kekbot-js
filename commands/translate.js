const translate = require('yandex-translate')(require('../config.json')["yandex-key"]);

module.exports = {
    name: 'translate',
    description: 'Translate words/sentences into other languages.',
    aliases: ['tr'],
    usage: '[language] [text]',
    cooldown: 2,
    arguments: true,
    execute(message, arguments) {
        let trString = "";
        for (let i = 1; i < arguments.length; i++) {
            if (i === arguments.length - 1) {
                trString += arguments[i];
            } else {
                trString += arguments[i] + " ";
            }
        }
        let trLang = arguments[0];
        translate.translate(trString, { to: trLang }, function (err, res) {
            if (err != null) {
                return console.error(err);
            }
            message.channel.send(`The translation for \"${trString}\" in \`${trLang}\` is \"${res.text}\"`);
        })
    },
};