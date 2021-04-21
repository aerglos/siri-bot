const emojiNums = {
    0: "0️⃣",
    1: "1️⃣",
    2: "2️⃣",
    3: "3️⃣",
    4: "4️⃣",
    5: "5️⃣",
    6: "6️⃣",
    7: "7️⃣",
    8: "8️⃣",
    9: "9️⃣",
    10: "🔟",
}
const emojiClocks = {
    "01": "🕐",
    "0130": "🕜",
    "02": "🕑",
    "0230": "🕝",
    "03": "🕒",
    "0330": "🕞",
    "04": "🕓",
    "0430": "🕟",
    "05": "🕔",
    "0530": "🕠",
    "06": "🕕",
    "0630": "🕡",
    "07": "🕖",
    "0730": "🕢",
    "08": "🕗",
    "0830": "🕣",
    "09": "🕘",
    "0930": "🕤",
    "10": "🕙",
    "1030": "🕥",
    "11": "🕚",
    "1130": "🕦",
    "12": "🕛",
    "1230": "🕧",
}
const fillRange = require('fill-range');
/*
const testMessage = {
    react: (reaction) => {
        console.log(`Test message with reaction: ${reaction}`)
    },
    content: "[poll] e? --res=tRange(01-05)",
    author: {bot: false}
}
 */
function execMessageArguments(message){
    const argumentHandlers = {
        "res": (answerTypeString, parsedArguments) => {
            answerTypeMethods[answerTypeString.replace(/\(.*\)/g, "")](answerTypeString, parsedArguments);
        }
    }
    const answerTypeMethods = {
        "nRange": (numRangeString) => {
            const ranges = numRangeString.match(/nRange\(([0-9]*)-([0-9]*)\)/)
            ranges.shift();
            let rangeArray = fillRange(ranges[0], ranges[1]);
            let numEmojiArray = rangeArray.map(num => {
                if(num <= 10 && num >= 0) {
                    return emojiNums[num]
                }
            })
            numEmojiArray.forEach(numEmoji => {
                message.react(numEmoji);
            })
        },
        "eSet": (emojiSetString) => {
            const emojiSet = emojiSetString.match(/eSet\(([^A-z, ][^A-z ]{1,}[^A-z, ])\)/)
            if(!emojiSet[1]) {
                return;
            } else {
                emojiSet[1].split(',').forEach(emoji => {
                    message.react(emoji);
                })
            }
        },
        "tRange": (timeRangeString, parsedArguments) => {
            const timeRanges = timeRangeString.match(/tRange\(([0-9]{2})-([0-9]{2})\)/)
            if(timeRanges[1] > 12 || timeRanges[2] > 12) {
                return;
            }
            let timeRangeArray = fillRange(timeRanges[1], timeRanges[2]);
            timeRangeArray.forEach(timeName => {
                message.react(emojiClocks[timeName])
                if(parsedArguments['sd']) {
                    message.react(emojiClocks[timeName + '30'])
                }
            })
        }

    }
    try {
        const parsedArguments = require('minimist')(message.content.split(" "));
        if(parsedArguments["res"]) {
            argumentHandlers.res(parsedArguments["res"], parsedArguments);
        }
    } catch (e) {
        console.log(e);
    }

}
function handleSuggestion(message) {
    if(message.author.bot) {
        message.delete()
    }
    function reactUpDown() {
        message.react("<:halal:751174121655894136>");
        message.react("<:haram:751174164303446137>");
    }
    function reactInfo() {
        message.react("ℹ️");
    }


    function flagMatch(...flags) {
        return flags.some(flag => {
            return message.content.startsWith(flag);
        })
    }
    switch(true) {
        case flagMatch("[info]", "INFO", "[INFO]"):
            if(!message.content.includes("--")) {
                reactInfo();
            } else {
                execMessageArguments(message)
            }
            break;
        case flagMatch("[poll]", "POLL", "[POLL]"):
            if(!message.content.includes("--")) {
                reactUpDown();
            } else {
                execMessageArguments(message)
            }
            break;
        case flagMatch("[vote]", "VOTE", "[VOTE]"):
            if(!message.content.includes("--")) {
                reactUpDown();
            } else {
                execMessageArguments(message)
            }
            break;
        case flagMatch("[execution]"):
            if(!message.member.roles.cache.has("801309669343494144")) {
                message.delete();
            } else {
                if(!message.content.includes("--")) {
                    reactInfo();
                } else {
                    execMessageArguments(message)
                }
            }
            break;
        default:
            message.delete();
            message.guild.channels.cache.get("822956323435708436").send(`${message.author}, you forget to flag your suggestion: \`${message.content}\`. Please resend it with one of the valid flags; [info], [poll], or [vote].`)
    }
}
module.exports = handleSuggestion