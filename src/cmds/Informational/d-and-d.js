const Campaign = require('../../../util/Campaign');
const Discord = require('discord.js')

module.exports = {
    name: "d-and-d",
    description: "Run Dungeons and Dragons commands",
    args: true,
    usage: 'd-and-d <command> [args]',
    execute(message, args) {
        if(message.guild.id !== "798306159987261502" && message.author.id !== "554404024422760458") return message.channel.send("This can only be used in the D&D Server");
        let command = args[0]
        switch(command) {
            case 'createCampaign':
                if(!message.member.roles.cache.has('798308544717914154') && message.author.id !== "554404024422760458") return message.channel.send("Missing permissions")
                let campaignMaster = message.mentions.members.first()
                if(!campaignMaster.roles.cache.has("798308332904906764")) return message.channel.send("The campaign DM must have the DM role.")
                let campaignDescription = message.content.split('|')[1]
                if(!campaignMaster || !campaignDescription) return message.channel.send("Please use the format `d-and-d createCampaign @themaindungeonmaster | description`")
                message.guild.roles.create({
                    data: {
                        name: `${campaignMaster.displayName}'s Campaign`,
                        color: "BLUE"
                    },
                    reason: "Campaign Create"
                })
                message.guild.channels.cache.find(c => c.id === "798308246469345352").send(new Discord.MessageEmbed().setTitle(`${campaignMaster.displayName}'s Campaign`).setDescription(campaignDescription).setColor("RANDOM").setAuthor(campaignMaster.displayName, campaignMaster.user.displayAvatarURL()))

        }
    }
}