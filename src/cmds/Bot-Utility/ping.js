module.exports = {
    name: "ping",
    description: "A simple ping command",
    execute(message, args) {
        message.channel.send("Pong!");
    }
}