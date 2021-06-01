module.exports = {
    name: 'Nickname',
    description: 'Change this bot\'s or any user\'s nickname.',
    aliases: ['nn'],
    usage: '~nn [@user] [nickname]',
    cooldown: 2,
    arguments: true,
    guildOnly: true,
    execute(message, arguments) {
        message.channel.startTyping()

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
            message.channel.stopTyping()
        } else if (!nickname) {
            message.channel.send('It doesn\'t seem like a very good idea to not have a nickname, does it?')
            message.channel.stopTyping()
        } else if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) {
            message.channel.send('I don\'t have permission to set nicknames in this server.')
            message.channel.stopTyping()
        } else {
            message.guild.members.fetch(message.mentions.users.first().id).then(member => {
                member.setNickname(nickname)
                message.channel.stopTyping()
            })
        }
    }
}
