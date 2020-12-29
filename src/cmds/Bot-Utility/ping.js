module.exports = {
    name: "ping",
    description: "A simple ping command",
    args: false,
    usage: "ping",
    keywords: ["ping", "utility"],
    execute(message, args, commandCollection) {
        message.channel.send(`Pong ${message.member}`);
    }
}
