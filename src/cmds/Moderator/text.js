const { MessageEmbed } = require('discord.js');
const once = require('once');

async function authCommand(message, args) {
    function waitForEnd(authCollector) {
        return new Promise(resolve => authCollector.on("end", resolve))
    }

    let authEmbed = new MessageEmbed()
        .setColor("YELLOW")
        .setTitle("Confirm text command")
        .setDescription(`Are you sure you want to execute a \`${args[0]}\` text command in the channel \`${message.channel.name}\``)
        .setAuthor(`AUTH for ${message.author.username}`, message.author.iconURL)
    let authenticated = false
    let authMsg = await message.channel.send("Please Authenticate", authEmbed)
    authMsg.react('✅')
    authMsg.react('❌')

    const filter = (reaction, user) => {
        return user.id === message.author.id
    }

    let authCollector = authMsg.createReactionCollector(filter, { time: 15000 })

    authCollector.on("collect", (reaction, user) => {
        if(reaction.emoji.name === "✅") {
            authenticated = true;
            authCollector.stop()
        }
        if(reaction.emoji.name === "❌")  {
            authCollector.stop()
        }
    })

    const [collected] = await waitForEnd(authCollector);

    if(authenticated) {
        authEmbed.setColor("GREEN").setTitle("Confirmed").setDescription("")
    } else {
        authEmbed.setColor("RED").setTitle("Denied").setDescription("")
    }
    authMsg.edit("Authentication Complete", authEmbed)
    authMsg.reactions.removeAll();


    return authenticated;
}

module.exports = {
    name: "text",
    description: "Execute a text command",
    args: true,
    usage: "text <command> [commandArg]",
    execute(message, args) {
        if(!message.member.permissions.has(["MANAGE_MESSAGES"]) && args[0] !== "poll") return message.channel.send("You must have the proper permissions to use this");
        if(message.channel.type === "dm") return message.channel.send("You can only use this in a server text channel");
        let textCmd = args[0];
        if(!textCmd) return message.channel.send("You need to have a command as an argument.")

        switch(textCmd) {
            case "purge":
                if(!args[1]) return message.channel.send("You need to specify an amount to purge.")
                if(args[1] > 100 || args[1] < 1) return message.channel.send("Purge amount cannot be more than 100 or less than one messages")
                try {
                    authCommand(message, args).then(auth => {
                        if(auth) {
                            message.channel.bulkDelete(args[1])
                        }
                    })
                } catch (e) {
                    console.log(e)
                    return message.channel.send("Something went wrong while purging")
                }
                break;
            case 'poll':
                if(!args[1]) return message.channel.send("You need to poll something!")
                let pollAr = args.shift()
                let pollString = args.join(" ")
                message.delete()
                let pollEmbed = new MessageEmbed()
                    .setTitle("POLL")
                    .setDescription(pollString)
                    .setColor("RANDOM")
                    .setAuthor(message.member.displayName, message.author.displayAvatarURL())

                message.channel.send(pollEmbed).then(pollMsg => {
                    pollMsg.react("✅")
                    pollMsg.react("❌")
                    pollMsg.react("⏹")
                    let filter = (reaction, user) => {
                        return user.id === message.author.id
                    }

                    let pollColl = pollMsg.createReactionCollector(filter)

                    pollColl.on("collect", (reaction, user) => {
                        if(reaction.emoji.name === "⏹") {
                            pollEmbed.setColor("GREY")
                            pollEmbed.setTitle("POLL ENDED")
                            pollMsg.edit(pollEmbed)
                            reaction.remove()
                            pollColl.stop()
                        }
                    })
                })

        }

    }
}