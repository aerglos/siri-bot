module.exports = {
    name: "ping",
    description: "A simple ping command",
    keywords: ["ping", "utility"],
    execute(message, args, commandCollection) {
        message.channel.send(`Pong ${message.member}`);
    }
}
