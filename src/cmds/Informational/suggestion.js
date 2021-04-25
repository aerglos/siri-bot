const { MessageEmbed } = require('discord.js')
function generateRowEmbed(row, guild) {
    let author = guild.members.cache.get(row.sender_id);
    return new MessageEmbed()
        .setTitle("Suggestion Info 📬")
        .setAuthor(author.displayName, author.user.displayAvatarURL())
        .setDescription(row.content)
        .addField("Sender ID", row.sender_id)
        .addField("Suggestion ID", row.suggestion_id)
        .addField("Suggestion Type", row.suggestion_type)
        .addField("Timestamp", row.timestamp)
        .setURL(row.permalink)
        .setTimestamp(Date.now())
        .setColor("#45ff61")

}
function generateErrorEmbed(name, queryString, color) {
    return new MessageEmbed()
        .setTitle(name)
        .setDescription("```sql\n"+queryString+"```")
        .setColor(color)
}

function executeSuggestionGenerator(message, content) {
    function respondTo(responseContent) {
        message.channel.send(responseContent).then(msg => qandaMessages.push(msg))
    }
    let qandaMessages = [];
    let suggestionResponse = {
        type: null,
        content: null,
        responseType: null,
        specialFlags: []
    }
    function buildSuggestionString() {
        return `${suggestionResponse.type} ${suggestionResponse.content} ${suggestionResponse.specialFlags.join(' ')}`
    }
    let step = 0;
    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id)
    if(message.guild.id !== "750874436928012289") return message.channel.send("Cipollahouse only.");
    suggestionResponse.content = content;
    respondTo("Send your suggestion type. Poll 💭, or Vote 🗳");
    collector.on("collect", (msg) => {
        switch(step) {
            case 0:
                if (msg.content.toLowerCase().includes('💭')) {
                    suggestionResponse.type = "POLL"
                } else {
                    suggestionResponse.type = "VOTE"
                }
                step++;
                respondTo("Got it. Now what type of responses will you be getting? Times ⏱, Subdivided times (XX:30) ⏲, Default 🖐️, Numbers 0️⃣, or Emojis 😀");
                break;
            case 1:
                if (msg.content.includes("⏱")) {
                    suggestionResponse.responseType = "TIME"
                    respondTo("Got it. Now, from which time to which time will you be accepting. Format your response like 01-02 for 1-2. DO NOT include :30, it will be done for you.")
                } else if (msg.content.includes("⏲")) {
                    suggestionResponse.responseType = "SUB_TIME"
                    respondTo("Got it. Now, from which time to which time will you be accepting. Format your response like 01-02 for 1-2. DO NOT include :30, it will be done for you.")
                } else if (msg.content.includes("0️⃣")) {
                    suggestionResponse.responseType = "NUMBERS"
                    respondTo("Got it. Now, from which number to which number will you be accepting. Format your response like 5-8 if you're accepting 5, 6, 7, and 8. Numbers range from 1 to 9. Do not type any higher number")
                } else if (msg.content.includes("😀")) {
                    suggestionResponse.responseType = "EMOJIS"
                    respondTo("Got it. Now, send the emojis you will be accepting. Separated by spaces and spaces only.")
                } else {
                    suggestionResponse.responseType = "DEFAULT"
                    respondTo("Got it. Now, resend the word DEFAULT, in all caps, to confirm.")
                }
                step++;
                break;
            case 2:
                let numberMatches = msg.content.match(/(\d{1,2})-(\d{1,2})/g);
                switch(suggestionResponse.responseType) {
                    case "TIME":
                        if(!numberMatches) {
                            respondTo("This does not match the specifications. Please re-look at the specifications.");
                        } else {
                            suggestionResponse.specialFlags.push(`--res=tRange(${numberMatches[1]}-${numberMatches[2]})`);
                            respondTo(`Got it. Now, paste this suggestion in to suggestions. \`${buildSuggestionString()}\``);
                            collector.stop()
                        }
                        break;
                    case "SUB_TIME":
                        if(!numberMatches) {
                            respondTo("This does not match the specifications. Please re-look at the specifications.");
                        } else {
                            suggestionResponse.specialFlags.push(`--res=tRange(${numberMatches[1]}-${numberMatches[2]})`);
                            suggestionResponse.specialFlags.push(`--sd`)
                            respondTo(`Got it. Now, paste this suggestion in to suggestions. \`${buildSuggestionString()}\``);
                            collector.stop()
                        }
                        break;
                    case "NUMBERS":
                        if(!numberMatches) {
                            respondTo("This does not match the specifications. Please re-look at the specifications.");
                        } else {
                            suggestionResponse.specialFlags.push(`--res=tRange(${numberMatches[1]}-${numberMatches[2]})`);
                            respondTo(`Got it. Now, paste this suggestion in to suggestions. \`${buildSuggestionString()}\``);
                            collector.stop()
                        }
                        break;
                    case "EMOJIS":
                        if(msg.content.match(/\w/)) {
                            respondTo("This does not match the specifications. Please re-look at the specifications.");
                        } else {
                            suggestionResponse.specialFlags.push(`--res=eSet(${msg.content.replace(" ", ",")})`)
                            respondTo(`Got it. Now, paste this suggestion in to suggestions. \`${buildSuggestionString()}\``);
                            collector.stop()
                        }
                        break;
                    case "DEFAULT":
                        if(msg.content.includes("DEFAULT")) {
                            respondTo(`Got it. Now, paste this suggestion in to suggestions. \`${buildSuggestionString()}\``);
                            collector.stop()
                        } else {
                            step--;
                            respondTo("Resend what type you'd like to specify, then.");
                        }
                        break;
                }
        }
    })
    collector.on('end', (collected) => {
        collected.each(response => {
            response.delete();
        })
        qandaMessages.forEach(msg => {
            msg.delete();
        })
    })
}

module.exports = {
    name: "suggestion",
    description: "Get or make suggestion",
    args: true,
    usage: "suggestion <get/make> [content]",
    async execute(message, args) {
        if(message.guild.id !== "750874436928012289") {
            return message.channel.send("Cipollahouse only")
        }
        const {postgresClient} = require("../../../index");
        if (args[0] === "get") {
            if (!args[1]) {
                return message.channel.send("Please specify a suggestion ID");
            } else {
                let res = (await postgresClient.query(`SELECT * FROM suggestions WHERE suggestion_id='${args[1]}'`));
                if (res.rows.length <= 0) {
                    return message.channel.send(new MessageEmbed()
                        .setTitle("Suggestion Not Found")
                        .setDescription(`No suggestion found with the ID ${args[1]}`)
                        .setColor("#ff4545")
                        .setTimestamp(Date.now())
                        .setAuthor(message.guild.me.displayName, message.client.user.displayAvatarURL()))
                } else {
                    return message.channel.send(generateRowEmbed(res.rows[0], message.guild))
                }
            }
        } else if (args[0] === "make") {
            let fixedArgs = [...args];
            fixedArgs.shift();
            executeSuggestionGenerator(message, `${fixedArgs.join(" ")}`);
        } else if (args[0] === "find") {
            const parsedArguments = require('minimist')(message.content.split(" "));
            let queryClauses = []
            if (parsedArguments["fromUsr"]) {
                queryClauses.push(`sender_id='${message.mentions.users.first().id}'`)
            }
            if (parsedArguments["type"]) {
                queryClauses.push(`suggestion_type='${parsedArguments['type']}'`)
            }
            if (parsedArguments['content']) {
                queryClauses.push(`content LIKE '${parsedArguments['content']}%'`)
            }
            let queryString = `SELECT * FROM suggestions WHERE ${queryClauses.join(" AND ")}`
            message.channel.send(new MessageEmbed().setTitle("Searching... 🔍").setDescription("```sql\n" + queryString + "\n```"))
            let queryResponse;
            try {
                queryResponse = (await postgresClient.query(queryString)).rows;
            } catch (e) {
                return message.channel.send(generateErrorEmbed("Error 🛑", queryString, "#ab0000"))
            }
            if(queryResponse.length === 0) {
                return message.channel.send(generateErrorEmbed("None found 📭", queryString, "#ff4545"))
            }
            if(queryResponse.length > 4) {
                message.channel.send("The response amount is pretty high, so I'll send it in a spam channel (bot commands)")
                const botCmdsChan = message.guild.channels.cache.get("801578818623111168");
                queryResponse.forEach(row => {
                    botCmdsChan.send(generateRowEmbed(row, message.guild))
                })
            } else {
                queryResponse.forEach(row => {
                    message.channel.send(generateRowEmbed(row, message.guild))
                })
            }
        }
    }
}