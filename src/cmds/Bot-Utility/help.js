const Discord = require("discord.js");
module.exports = {
    name: "help",
    description: "Get help on a single command, or all commands",
    args: false,
    usage: `help [command]`,
    async execute(message, args) {
        function buildCmdEmbed(command) {
            return new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(command.name)
                .setDescription(command.description)
                .addField("Info:", `Requires Arguments: ${command.args}\nUsage: ${command.usage}`)
        }
        let commandCol = message.client.commandCollection;
        if(!args[0]) {
            let finalMsg = "**COMMAND LIST**\n";
            commandCol.array().forEach(v => {
                finalMsg = finalMsg + ` **${v.name}**;\n\`\`\`Description: ${v.description}\nRequires arguments: ${v.args}\nUsage: ${v.usage}\`\`\`\n`
            })
            finalMsg = finalMsg + "React with ❌ to delete this when you're done reading."
            let helpMsg: Message = await message.channel.send(finalMsg);

            helpMsg.react('❌');

            let awaitCloseCollector = helpMsg.createReactionCollector((r, u) => { return u.id === message.author.id && r.emoji.name === "❌"}, { time: 15000})

            awaitCloseCollector.on("collect", (r, u) => {
                helpMsg.edit("**COMMAND LIST**\n`...`\n*Remove your ❌ reaction to open again*")
            })

            awaitCloseCollector.on("remove", (r, u) => {
                helpMsg.edit(finalMsg)
            })
            awaitCloseCollector.on("end", (c, reason) => {
                helpMsg.edit("**COMMAND LIST**\n`...`")
            })
        } else if(args[0] !== 'scrollMenu') {
            let command = commandCol.get(args[0])
            if(!command) return message.channel.send(`I can't find a command that doesn't exsist!`)

            message.channel.send(buildCmdEmbed(command))
        } else if(args[0] === "scrollMenu") {
            let onCmd = 0;
            let menuMsg = await message.channel.send(buildCmdEmbed(commandCol.array()[onCmd]));

            menuMsg.react("⬅️")
            menuMsg.react('❌')
            menuMsg.react("➡️")
            let scrollCollector = menuMsg.createReactionCollector((r, u) => {return u.id === message.author.id }, {time: 30000})
            scrollCollector.on("collect", (r, u) => {
                switch(r.emoji.name) {
                    case '⬅️':
                        if(onCmd >= 0) {
                            onCmd -= 1
                        }
                        break;
                    case '➡️':
                        if(onCmd < commandCol.array().length) {
                            onCmd += 1
                        }
                        break;
                    case '❌':
                        scrollCollector.stop()
                        break;
                    default:
                        message.channel.send("That's not a valid scroll command.");
                        break;
                }
                menuMsg.edit(buildCmdEmbed(commandCol.array()[onCmd]))
            })


        }
    }
}