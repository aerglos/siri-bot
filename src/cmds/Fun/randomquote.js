module.exports = {
    name: "randomquote",
    description: "Get a random cipollahouse quote",
    args: false,
    usage: 'randomquote [fromuser]',
    cooldown: 5,
    async execute(message, args) {
        let quoteMsgArray = (await (message.guild.channels.cache.find(c => c.name === "quotes")).messages.fetch({}, true)).array()
        let selectedQuote = quoteMsgArray[Math.floor(Math.random() * quoteMsgArray.length)]

        message.channel.send(selectedQuote.content)
    }
}