module.exports = {
    name: 'emit',
    description: "Dev only",
    args: true,
    usage: "emit [event] [args]",
    execute(message, args) {
        if(message.author.id !== "554404024422760458") {
            return message.channel.send("Cannot use unless you are a developer.")
        }

        switch(args[1]) {
            case 'memberAdd':
                message.client.emit(args[0], (message.member))
                break;
            case 'guildCreate':
                message.client.emit(args[0], (message.guild))
                break;
        }
    }
}