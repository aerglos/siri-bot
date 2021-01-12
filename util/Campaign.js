const Discord = require('discord.js');
module.exports = class Campaign {
    constructor(message, args) {
        this.message = message;
        this.args = args;
    }
    create() {
        let message = this.message
        let args = this.args
        let filter = (msg) => {
            return msg.author.id === message.author.id;
        }

        message.channel.send("We're going to start the campaign setup. It will be quick. Reply with anything to begin.");
        let onStep = 1;

        let campaignOptions = {}

        let creatorColl = message.channel.createMessageCollector(filter, {time: 60000})

        creatorColl.on('collect', (msg) => {
            switch(onStep) {
                case 1:
                    message.channel.send("Who is the main Campaign DM? (Ping them)")
                    campaignOptions.dungeonMaster = msg.mentions.members.first()
                    onStep++
                    break;
                case 2:
                    message.channel.send("Awesome. Would you like me to create a role? (yes/no)")
                    campaignOptions.addRole = msg.content.toLowerCase()
                    console.log(campaignOptions)
                    onStep++
                    break;
                case 3:
                    message.channel.send("Delightful. Give a short description of the campaign. Literally anything.")
                    campaignOptions.desc = msg.content;
                    onStep++
                    break;
                case 4:
                    message.channel.send(`Great. So the main DM is \`${campaignOptions.dungeonMaster.displayName}\` and would you like me to create a role? \`${campaignOptions.addRole}\`. Look good? (yes/no)`)
                    if(msg.content.toLowerCase() === "yes") {
                        campaignOptions.do = true
                        message.channel.send("Got it. Give me one second to complete it...")
                        onStep++
                    } else {
                        campaignOptions.do = false
                        message.channel.send("Got it. I won't do it.")
                        creatorColl.stop()
                    }
                    break;
            }
            if(onStep === 5) {
                message.guild.roles.create({
                    data: {
                        name: campaignOptions.dungeonMaster,
                        color: "BLUE"
                    },
                    reason: "Create campaign"
                });
                message.channel.bulkDelete(10)
                message.channel.send(new Discord.MessageEmbed().setTitle(`${campaignOptions.dungeonMaster.displayName}'s Campaign`).setDescription(campaignOptions.desc).setColor("RANDOM").setAuthor(campaignOptions.dungeonMaster.displayName, campaignOptions.dungeonMaster.displayAvatarURL()))
            }
        })



    }
}