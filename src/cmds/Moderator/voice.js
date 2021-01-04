module.exports = {
    name: "voice",
    description: "Assorted admin voice comands",
    args: true,
    usage: "voice <command> [specificCommandArgs]",
    execute(message, args) {
        if(!message.member.roles.cache.has("750894397113106453")) return message.channel.send("You need at least the onioneer role to use this");
        if(!message.member.voice.channel) return message.channel.send("You must be in a channel to use this command");
        let memberChan = message.member.voice.channel;
        switch(args[0].toLowerCase()) {
            case 'disconnectall':
                memberChan.members.forEach(m => {
                    if(m.id !== message.member.id && !m.roles.cache.has("750897614550990959")) m.voice.kick()
                })
                break;
            case 'muteall':
                memberChan.members.forEach(m => {
                    if(m.id !== message.member.id) m.voice.setMute(true)
                })
                break;
            case 'unmuteall':
                memberChan.members.forEach(m => {
                    if(m.id !== message.member.id) m.voice.setMute(false)
                })
                break;
            case 'deafall':
                memberChan.members.forEach(m => {
                    if(m.id !== message.member.id) m.voice.setDeaf(true)
                })
                break;
            case 'undeafall':
                memberChan.members.forEach(m => {
                    if(m.id !== message.member.id) m.voice.setDeaf(false)
                })
                break;
            case 'mute':
                if(!message.mentions.members.first() || !message.mentions.members.first().voice.channel) return message.channel.send("You must tag the person to mute, and they must be in a VC")
                memberChan.members.find(m => m.id === message.mentions.users.first().id).voice.setMute(true)
                break;
            case 'deafen':
                if(!message.mentions.members.first() || !message.mentions.members.first().voice.channel) return message.channel.send("You must tag the person to deafen, and they must be in a VC")
                memberChan.members.find(m => m.id === message.mentions.users.first().id).voice.setDeaf(true)
                break;
            case 'disconnect':
                if(!message.mentions.members.first() || !message.mentions.members.first().voice.channel) return message.channel.send("You must tag the person to disconnect, and they must be in a VC")
                memberChan.members.find(m => m.id === message.mentions.users.first().id).voice.kick()
                break;
            default:
                return message.channel.send("That's not a voice command");
                break;
        }
    }
}