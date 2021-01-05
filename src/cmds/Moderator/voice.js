const Discord = require("discord.js");
module.exports = {
    name: "voice",
    description: "Assorted admin voice comands",
    args: true,
    usage: "voice <command> [specificCommandArgs]",
    async execute(message, args) {
        if(!message.member.roles.cache.has("750894397113106453")) return message.channel.send("You need at least the onioneer role to use this");
        if(!message.member.voice.channel) return message.channel.send("You must be in a channel to use this command");
        let memberChan = message.member.voice.channel;
        if(!args[0]) return message.channel.send("Please specify a voice command.")
        switch(args[0].toLowerCase()) {
            case 'disconnectall':
                memberChan.members.forEach(m => {
                    if(m.id !== message.member.id && !m.roles.cache.has("750897614550990959")) m.voice.kick(message.author.username)
                })
                message.channel.send("Executed voice command.")
                break;
            case 'muteall':
                memberChan.members.forEach(m => {
                    if(m.id !== message.member.id) m.voice.setMute(true, message.author.username)
                })
                message.channel.send("Executed voice command.")
                break;
            case 'unmuteall':
                memberChan.members.forEach(m => {
                    if(m.id !== message.member.id) m.voice.setMute(false, message.author.username)
                })
                message.channel.send("Executed voice command.")
                break;
            case 'deafall':
                memberChan.members.forEach(m => {
                    if(m.id !== message.member.id) m.voice.setDeaf(true, message.author.username)
                })
                message.channel.send("Executed voice command.")
                break;
            case 'undeafall':
                memberChan.members.forEach(m => {
                    if(m.id !== message.member.id) m.voice.setDeaf(false, message.author.username)
                })
                message.channel.send("Executed voice command.")
                break;
            case 'mute':
                if(!message.mentions.members.first() || !message.mentions.members.first().voice.channel) return message.channel.send("You must tag the person to mute, and they must be in a VC")
                memberChan.members.find(m => m.id === message.mentions.users.first().id).voice.setMute(true, message.author.username)
                message.channel.send("Executed voice command.")
                break;
            case 'unmute':
                if(!message.mentions.members.first() || !message.mentions.members.first().voice.channel) return message.channel.send("You must tag the person to unmute, and they must be in a VC")
                memberChan.members.find(m => m.id === message.mentions.users.first().id).voice.setMute(false, message.author.username)
                message.channel.send("Executed voice command.")
                break;
            case 'tempunmute':
                if(!message.mentions.members.first() || !message.mentions.members.first().voice.channel) return message.channel.send("You must tag the person to temporarily unmute, and they must be in a VC")
                if(!args[2]) return message.channel.send("You must specify a time in seconds to mute the user");
                let memberToTempUnmute = memberChan.members.find(m => m.id === message.mentions.users.first().id)
                memberToTempUnmute.voice.setMute(false, message.author.username)
                message.channel.send(`Unmute started on user ${memberToTempUnmute} for ${args[2]} seconds.`)
                await new Promise(r => setTimeout(r, args[2] * 1000));
                message.channel.send(`Ended unmute on user ${memberToTempUnmute} after ${args[2]} seconds.`)
                memberToTempUnmute.voice.setMute(true, message.author.username)
                break;
            case 'deafen':
                if(!message.mentions.members.first() || !message.mentions.members.first().voice.channel) return message.channel.send("You must tag the person to deafen, and they must be in a VC")
                memberChan.members.find(m => m.id === message.mentions.users.first().id).voice.setDeaf(true, message.author.username)
                message.channel.send("Executed voice command.")
                break;
            case 'disconnect':
                if(!message.mentions.members.first() || !message.mentions.members.first().voice.channel) return message.channel.send("You must tag the person to disconnect, and they must be in a VC")
                memberChan.members.find(m => m.id === message.mentions.users.first().id).voice.kick()
                message.channel.send("Executed voice command.")
                break;
            case 'summon':
                let membersInVc = []
                let guildVcs = message.guild.channels.cache.filter(c => c.type === "voice");
                guildVcs.forEach(vc => {
                    if(!vc.members) return;
                    vc.members.forEach(m => membersInVc.push(m))
                })
                membersInVc.forEach(m => m.voice.setChannel(message.member.voice.channel))
                message.channel.send("Moved all members in VC to your VC")
                break;
            default:
                return message.channel.send("That's not a voice command, valid commands are; `disconnectall`, `muteall`, `unmuteall`, `deafall`, `undeafall`, `mute`, `unmute`, `tempunmute`, `deafen`, `disconnect`, and `summon`");
                break;
        }
    }
}