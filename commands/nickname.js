module.exports = {
    name: 'nickname',
    description: 'Change this bot\'s or any user\'s nickname.',
    aliases: ['nn'],
    usage: '[@user] [nickname]',
    cooldown: 2,
    arguments: true,
    execute(message, arguments) {
        let nickname = ""
        for (let i = 1; i < arguments.length; i++) {
            if (i === arguments.length - 1) {
                nickname += arguments[i]
            } else {
                nickname += arguments[i] + " "
            }
        }

        let user = arguments[0]
        if (!user) {
            message.channel.send('No user has been mentioned.')
        } else if (!nickname) {
            message.channel.send('It doesn\'t seem like a very good idea to not have a nickname, does it?')
        } else if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) {
            message.channel.send('I don\'t have permission to set nicknames in this server.')
        } else {
            message.guild.members.fetch(message.mentions.users.first().id).then(member => {
                member.setNickname(nickname)
            })
        }
    }
}
