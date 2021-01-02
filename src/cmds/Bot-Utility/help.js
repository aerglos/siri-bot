const Discord = require("discord.js");
module.exports = {
    name: "help",
    description: "Get help on a single command, or all commands",
    args: false,
    usage: `help [command]`,
    execute(message, args) {
        let commandCol = message.client.commandCollection;
        if(!args[0]) {
            let finalMsg = "**COMMAND LIST**\n";
            commandCol.array().forEach(v => {
                finalMsg = finalMsg + ` **${v.name}**;\n\`\`\`Description: ${v.description}\nRequires arguments: ${v.args}\nUsage: ${v.usage}\`\`\`\n`
            })
            message.channel.send(finalMsg);
        } else {
            let command = commandCol.get(args[0])
            if(!command) return message.channel.send(`I can't find a command that doesn't exsist!`)

            message.channel.send(
                new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(command.name)
                    .setDescription(command.description)
                    .addField("Info:", `Requires Arguments: ${command.args}\nUsage: ${command.usage}`)
            )
        }
    }
}