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

function reactUpDown(msg) {
    msg.react("<:halal:751174121655894136>");
    msg.react("<:haram:751174164303446137>");
}
function reactInfo(msg) {
    msg.react("ℹ️");
}
function flagMatch(msgContent, ...flags) {
    return flags.some(flag => {
        return msgContent.startsWith(flag);
    })
}
async function addToDb(suggestionType, pgC, msgContent, msgAuthor, msgUrl, suggestionId) {
    let queryRes = await pgC.query(
        `INSERT INTO suggestions VALUES ('${suggestionId}', '${msgContent}', '${msgAuthor.id}', '${suggestionType}', NOW(), '${msgUrl}')`
    )
}

function execMessageArguments(msg, msgContent){
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
                msg.react(numEmoji);
            })
        },
        "eSet": (emojiSetString) => {
            const emojiSet = emojiSetString.match(/eSet\(([^A-z, ][^A-z ]{1,}[^A-z, ])\)/)
            if(!emojiSet[1]) {
                return;
            } else {
                emojiSet[1].split(',').forEach(emoji => {
                    msg.react(emoji);
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
                msg.react(emojiClocks[timeName])
                if(parsedArguments['sd']) {
                    msg.react(emojiClocks[timeName + '30'])
                }
            })
        }

    }
    try {
        const parsedArguments = require('minimist')(msgContent.split(" "));
        if(parsedArguments["res"]) {
            argumentHandlers.res(parsedArguments["res"], parsedArguments);
        }
    } catch (e) {
    }

}



function handleSuggestion(message, postgresClient) {
    const suggestionId = `S-${Date.now().toString()}`
    const messageCodeBlock = "```txt\n" + message.content + "\n```";
    let sendable = false;
    let isExec = false;
    let messageType;
    if(message.author.bot) {
        return;
    }
    switch(true) {
        case flagMatch(message.content, "[vote]", "VOTE"):
            sendable = true;
            messageType = 'vote';
            break;
        case flagMatch(message.content, "[poll]", "POLL"):
            sendable = true;
            messageType = 'poll';
            break;
        case flagMatch(message.content, "[exec]", "EXEC"):
            sendable = false;
            isExec = true;
            break;
    }
    if(!isExec) message.delete();
    if(sendable) {
        message.channel.send(`Suggestion from ${message.author}\n${messageCodeBlock}\nID: ${suggestionId}`).then(msg => {
            execMessageArguments(msg, message.content);
            reactUpDown(msg)
            addToDb(messageType, postgresClient, message.content, message.author, msg.url, suggestionId);
        });
    } else if(isExec) {
        reactInfo(message);
    }
}
module.exports = handleSuggestion