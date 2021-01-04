const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "profile",
    description: "Get a user's profile",
    args: false,
    usage: "profile [@user]",
    execute(message, args) {
        let user = message.mentions.users.first() || message.author;
        let member = message.mentions.members.first() || message.member;
        let lastMessage = "`none`";
        if(user.lastMessage) lastMessage = `"${user.lastMessage.content}"`;
        let playingGame = "`nothing`"
        let playingImage = null;
        if(user.presence.activities[0].timestamps) {
            let playingMiliseconds = Date.now() - user.presence.activities[0].timestamps.start
            let playingSeconds = playingMiliseconds / 1000
            let playingMinutes = Math.round(playingSeconds / 60)
            let playingHours = Math.floor(playingMinutes / 60);
            let playingProp = `${playingMinutes} minutes`
            if(playingMinutes >= 60) playingProp = `${playingHours} hours`
            playingGame = `${user.presence.activities[0].name} for ${playingProp}`
            if(user.presence.activities[0].assets) playingImage = user.presence.activities[0].assets.smallImageURL()
        }
        let profileEmbed = new MessageEmbed()
            .setColor(member.displayHexColor || "RANDOM")
            .setTitle(`Profile for ${user.tag}`)
            .setDescription(`\u200b`)
            .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
            .addField(`Created At:`, user.createdAt.toString().replace(/GMT.*/g, ""), true)
            .addField(`Status:`, user.presence.status, true)
            .addField(`User Id:`, `\`${user.id}\``, true)
            .addField(`Joined this server:`, member.joinedAt.toString().replace(/GMT.*/g, ""), true)
            .addField(`Nickname:`, `\`${member.displayName}\``, true)
            .addField(`Most recent message:`, lastMessage)
            .addField('Playing:', playingGame)
            .setThumbnail(user.displayAvatarURL())
            .setImage(playingImage)
        message.channel.send(profileEmbed)
    }
}