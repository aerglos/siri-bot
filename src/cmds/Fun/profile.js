const {getOrMakeProfile} = require('../../economy/database/profile');
const { MessageEmbed } = require('discord.js');
function genProfileEmbed(rowObj, userCache) {
    let authorObj = userCache.get(rowObj.user_id).user
    return new MessageEmbed()
        .setTitle("Profile")
        .setAuthor(authorObj.username, authorObj.displayAvatarURL())
        .setDescription(`Profile for ${authorObj}`)
        .addField("Coins", rowObj.coins)
        .addField("Lumens", rowObj.lumens)
        .setTimestamp(Date.now())
        .setThumbnail(authorObj.displayAvatarURL())
        .setColor("RANDOM")
}
module.exports = {
    name: "profile",
    description: "Get your cipollahouse profile",
    args: false,
    usage: "profile [user]",
    cooldown: 3,
    async execute(message, args) {
        const profileRowObject = await getOrMakeProfile(message.author.id);
        message.channel.send(genProfileEmbed(profileRowObject, message.guild.members.cache))
    }
}