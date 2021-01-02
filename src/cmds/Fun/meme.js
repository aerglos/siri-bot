const got = require("got");
const Discord = require("discord.js");
module.exports = {
    name: "meme",
    description: "Get a meme",
    args: false,
    usage: "meme",
    keywords: ["fun", "meme"],
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        got('https://www.reddit.com/r/memes/random/.json').then(response => {
            let content = JSON.parse(response.body)[0];
            let permalink = content.data.children[0].data.permalink;
            let memeUrl = `https://reddit.com${permalink}`;
            let memeImage = content.data.children[0].data.url;
            let memeTitle = content.data.children[0].data.title;
            let memeUpvotes = content.data.children[0].data.ups;
            let memeDownvotes = content.data.children[0].data.downs;
            let memeNumComments = content.data.children[0].data.num_comments;
            embed.setTitle(`${memeTitle}`)
            embed.setURL(`${memeUrl}`)
            embed.setImage(memeImage)
            embed.setColor('RANDOM')
            message.channel.send(embed);
        })
    }
}