const dicer = require('trpg-dice');
module.exports = {
    name: "roll",
    description: "Roll D&D Dice",
    args: "true",
    usage: "roll <[amountOfDice]d[sideCount][+modifier]>",
    async execute(message, args) {
        let result;
        let roll = args.join()
        try {
            dicer.roll(roll, (err, res) => {
                result = res
            });
        } catch (e) {
            return message.channel.send("I can't roll that.")
        }
        message.channel.send(`${message.author}\n  **Roll**: *${result.expression}*\n  **Result**: *${result.rolls[0].result}*\n  **Roll Combo**: *${result.rolls[0].resultString.replace(/\(|\)/g, "")}*`)
    }
}