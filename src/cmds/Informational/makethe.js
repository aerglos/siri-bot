const Discord = require("discord.js");
module.exports = {
    name: "makethe",
    description: "Execute an addition",
    args: true,
    usage: "makethe <thing> [commandArg]",
    execute(message, args) {
        let toMake = args[0].toLowerCase();
        switch (toMake) {
            case 'rules':
                if(args[1].toLowerCase() === "cipollahouse") {
                    require('../../assets/makeThis/rule/cipollahouse.json').embeds.forEach((emObj) => {
                        message.channel.send(new Discord.MessageEmbed().setTitle(emObj.title).setDescription(emObj.description).setColor(emObj.color || "#34d2eb"))
                    })

                } else {
                    message.channel.send("I don't have the rules config for that.")
                }
                break;
            default:
                message.channel.send("I can't make that")
        }
    }
}