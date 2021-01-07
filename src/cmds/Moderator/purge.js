module.exports = {
    name: "purge",
    description: "Purge messages from a channel",
    args: true,
    usage: "purge <messageCount>",
    execute(message, args) {
        if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("You need manage message permissions to use this")
        if(args[0] > 100) return message.channel.send("Purge amount cannot be more than 100 messages")
        try {
            message.channel.bulkDelete(args[0])
        } catch (e) {
            console.log(e)
            return message.channel.send("Something went wrong while purging")
        }
    }
}