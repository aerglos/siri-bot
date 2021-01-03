const fetch = require('node-fetch');
const Discord = require('discord.js');
async function searchDjs(message, args) {
    let ogMsg = await message.channel.send(`Searching \`${args[1] || stable}\` for \`${message.content.split('|')[1]}\`...`)
    let source = args[1] || "stable";
    let query = message.content.split('|')[1]
    let searchResponse = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=${source}&q=${query}`).then(r => r.json())
    if(searchResponse.status === 404) return message.channel.send(`I couldn't find anything from the source \`${source}\`, make sure it's a valid one (Valid sources include; stable, master, rpc, commando, akairo, or akairo-master)`);
    ogMsg.edit(`Here's what I found ${message.author}`, {embed: searchResponse});
}

async function searchMdn(message, args) {
    let ogMsg = await message.channel.send(`Searching the MDN docs for \`${message.content.split('|')[1]}\``)
    let query = message.content.split('|')[1]
    let selectedDoc = 0
    let searchResponse = await fetch(`https://developer.mozilla.org/api/v1/search/en-US?q=${query}`).then(r => r.json())
    let responseDoc = searchResponse.documents[selectedDoc];
    let responseEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor('MDN Docs')
        .setThumbnail("https://developer.mozilla.org/static/img/opengraph-logo.72382e605ce3.png")
        .setTitle(responseDoc.title)
        .setURL(`https://developer.mozilla.org/en-US/docs/${responseDoc.slug}`)
        .setDescription(responseDoc.excerpt.replace(/<mark>|<\/mark>/g, ""))
    ogMsg.edit(`Here's what I found ${message.author}`, responseEmbed)
}

module.exports = {
    name: "docs",
    description: "Search JS or DiscordJS documentation",
    args: true,
    usage: "docs [djs/mdn] [for djs: source] | my search query",
    keywords: ["information", "code", "help", "info", "docs"],
    execute(message, args) {
        switch(args[0].toLowerCase()) {
            case 'djs':
                searchDjs(message, args);
                break;
            case 'mdn':
                searchMdn(message, args);
                break;
            default:
                message.channel.send('Please specify which docs to search, `djs` or `js`');
                break;
        }
    }
}