const Discord = require("discord.js");
module.exports = {
    name: "ping",
    description: "A simple ping command",
    args: false,
    usage: "ping",
    keywords: ["ping", "utility"],
    execute(message, args, commandCollection) {
        message.channel.send("Pinging...").then(sent => {
            let pingEmbed = new Discord.MessageEmbed()
                .setDescription(`**Heartbeat: ${message.client.ws.ping}ms**\n\n**Ping: ${sent.createdTimestamp - message.createdTimestamp}ms**`)
                .setColor("GREEN")
            sent.edit(`${message.author}`, pingEmbed)
        })
    }
}
