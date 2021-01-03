const Discord = require("discord.js");
module.exports = {
    name: "rickroll",
    description: "test it and see for yourself",
    args: false,
    usage: "rickroll [user]",
    cooldown: 10,
    execute(message, args) {
        let rickRollEmbed = new Discord.MessageEmbed().setTitle(`You've been rickrolled by ${message.author.username}`).setURL(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`).setColor("RANDOM");
        if(!args[0]) return message.channel.send("Accept your fate", {files: ['./src/assets/notSus.mp3'], embed: rickRollEmbed})
        try {
            message.mentions.users.first().send(`Accept your fate ${message.mentions.users.first()}`, {files: ['./src/assets/notSus.mp3'], embed: rickRollEmbed})
        } catch (e) {
            message.channel.send("That user cannot be DM'd")
        }
    }
}