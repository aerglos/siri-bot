const fetch = require('node-fetch')
const Discord = require("discord.js");

module.exports = {
    name: "trivia",
    description: "A trivia command",
    args: false,
    usage: "trivia [difficulty (E, M, H] [allAnswer]",
    keywords: ["fun", "trivia", "question", "quiz"],
    execute(message, args) {
        let decoder = {
            difficulty: {
                e: "easy",
                m: "medium",
                h: "hard"
            },
            answerEmoji: {
                "False": "751174164303446137",
                "True": "751174121655894136"
            }
        }
        async function triviaInitializer(message) {
            let difficulty = decoder.difficulty[args[0]]
            if (!difficulty) difficulty = ''
            let triviaJson = await fetch(`https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&type=boolean`).then(r=>r.json())
            console.log(triviaJson.results[0].question);
            let triviaEmbed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Trivia Question\n")
                .addField(triviaJson.results[0].question.replace(/&\w*;/g, ""), "True: <:Check:751174121655894136>\nFalse: <:X_:751174164303446137>")
            let triviaM = await message.channel.send(`Here's your question ${message.member}!`,triviaEmbed);
            triviaM.react('751174121655894136');
            triviaM.react('751174164303446137');

            let reactionFilter;
            if(args[1] === 'allAnswer') {
                reactionFilter = (r, u) => {
                    return true;
                }
            } else {
                reactionFilter = (r, u) => {
                    return u.id === message.member.id;
                }
            }



            const answerCollector = triviaM.createReactionCollector(reactionFilter, {
                time: 15000
            })

            answerCollector.on('collect', (reaction, user) => {
                let correctEmojiId = decoder.answerEmoji[triviaJson.results[0].correct_answer]
                if(reaction.emoji.id === correctEmojiId) {
                    message.channel.send("Correct!")
                    triviaM.reactions.removeAll()
                    answerCollector.stop([user.username, 'correct'])
                } else {
                    message.channel.send(`Incorrect!`)
                    answerCollector.stop([user.username, 'incorrect'])
                }
            })
            answerCollector.on('end', (collected, reason) => {
                if(reason[1] === "correct") {
                    triviaEmbed.fields[0].value = `Correct answer was: ${triviaJson.results[0].correct_answer}\n${reason[0]} got it correct!`
                    triviaEmbed.color = "GREEN"
                } else {
                    triviaEmbed.fields[0].value = `Correct answer was: ${triviaJson.results[0].correct_answer}`
                    triviaEmbed.color = "RED"
                }
                triviaM.edit(triviaEmbed)
            })

        }
        triviaInitializer(message);
    }
}