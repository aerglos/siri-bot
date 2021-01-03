const { Util } = require('discord.js');

module.exports = {
    name: "randomquote",
    description: "Get a random cipollahouse quote",
    args: false,
    usage: 'randomquote [fromuser]',
    cooldown: 5,
    async execute(message, args) {
        let quoteMsgArray = (await (message.guild.channels.cache.find(c => c.name === "quotes")).messages.fetch({}, true)).array()
        if(args[0]) quoteMsgArray.filter(m => {  m.author.id === message.mentions.users.first().id })

        let selectedQuote = quoteMsgArray[Math.floor(Math.random() * quoteMsgArray.length)]

        if(args[0]) message.channel.send(selectedQuote.url);
        message.channel.send(Util.cleanContent(selectedQuote.content, message))
    }
}