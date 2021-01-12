const dicer = require('trpg-dice');
module.exports = {
    name: "roll",
    description: "Roll D&D Dice",
    args: "true",
    usage: "roll <[amountOfDice]d[sideCount][+modifier]>",
    async execute(message, args) {
        let result;
        try {
            dicer.roll(args[0], (err, res) => {
                result = res.rolls[0].result
            });
        } catch (e) {
            return message.channel.send("I can't roll that.")
        }
        message.channel.send(`${message.author}, the result is **${result}** 🎲`)
    }
}