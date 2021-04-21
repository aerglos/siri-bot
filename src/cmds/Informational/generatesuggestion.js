module.exports = {
    name: "generatesuggestion",
    description: "Generate a complex suggestion",
    args: true,
    usage: "generatesuggestion <suggestion content>",

    execute(message, args) {
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
        suggestionResponse.content = args.join(' ');
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
}