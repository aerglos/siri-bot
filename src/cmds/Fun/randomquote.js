const { Util } = require('discord.js');

module.exports = {
    name: "randomquote",
    description: "Get a random cipollahouse quote",
    args: false,
    usage: 'randomquote [fromuser]',
    cooldown: 5,
    async execute(message, args) {
        let quoteMsgArray = (await (message.client.guilds.cache.find(g => g.id === "750874436928012289").channels.cache.find(c => c.name === "quotes")).messages.fetch({}, true)).array()
        if(message.mentions.members.first()) {
            quoteMsgArray.filter(m => {
                m.mentions.members.first() === message.mentions.members.first()
            })
        }

        let selectedQuote = quoteMsgArray[Math.floor(Math.random() * quoteMsgArray.length)]

        if(!selectedQuote) message.channel.send("I couldn't find a quote from that user")

        message.channel.send(Util.cleanContent(selectedQuote.content, message))
    }
}