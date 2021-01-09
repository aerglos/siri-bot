const Tesseract = require('tesseract.js')
module.exports = {
    name: "solveproblem",
    description: "Solve a problem from a URL",
    args: true,
    usage: "solveproblem <imageURL>",
    cooldown: 20,
    execute(message, args) {
        Tesseract.recognize(
            'https://media.discordapp.net/attachments/784452170065248306/797364322707832832/unknown.png',
            'eng'
        ).then(({ data: { text } }) => {
            console.log(text);
        })
    }
}