const { Util } = require('discord.js');

module.exports = {
    name: "randomquote",
    description: "Get a random cipollahouse quote",
    args: false,
    usage: 'randomquote',
    cooldown: 5,
    async execute(message, args) {
        let quoteMsgArray = (await (message.client.guilds.cache.find(g => g.id === "750874436928012289").channels.cache.find(c => c.name === "quotes")).messages.fetch({}, true)).array()

        let selectedQuote = quoteMsgArray[Math.floor(Math.random() * quoteMsgArray.length)]

        message.channel.send(Util.cleanContent(selectedQuote.content, message))
    }
}