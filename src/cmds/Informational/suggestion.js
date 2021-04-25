const { MessageEmbed } = require('discord.js')
function generateRowEmbed(row, guild) {
    let author = guild.members.cache.get(row.sender_id);
    return new MessageEmbed()
        .setTitle("Suggestion Info")
        .setAuthor(author.displayName, author.user.displayAvatarURL())
        .setDescription(row.content)
        .addField("Sender ID", row.sender_id)
        .addField("Suggestion ID", row.suggestion_id)
        .addField("Suggestion Type", row.suggestion_type)
        .addField("Timestamp", row.timestamp)
        .setURL(row.permalink)
        .setTimestamp(Date.now())
        .setColor("#45ff61")

}
module.exports = {
    name: "suggestion",
    description: "Get or make suggestion",
    args: true,
    usage: "suggestion <get/make> [user]",
    async execute(message, args) {
        const { postgresClient } = require("../../../index");
        if(args[0] === "get") {
            if(!args[1]) {
                return message.channel.send("Please specify a suggestion ID");
            } else {
                let res = (await postgresClient.query(`SELECT * FROM suggestions WHERE suggestion_id='${args[1]}'`));
                if(res.rows.length <= 0) {
                    return message.channel.send(new MessageEmbed()
                        .setTitle("Suggestion Not Found")
                        .setDescription(`No suggestion found with the ID ${args[1]}`)
                        .setColor("#ff4545")
                        .setTimestamp(Date.now())
                        .setAuthor(message.guild.me.displayName, message.client.user.displayAvatarURL()))
                } else {
                    return message.channel.send(generateRowEmbed(res.rows[0], message.guild))
                }
            }
        } else if(args[0] === "make") {

        }
    }
}