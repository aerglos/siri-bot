const googleTTS = require('google-tts-api');

module.exports = {
    name: "tts",
    description: "Join your VC and say something!",
    args: true,
    usage: "tts <something to say>",
    serverCooldown: 5,
    cooldown: 8,
    async execute(message, args) {
        let fullMessageArgs = args.join(' ');
        let messageSplit = fullMessageArgs.split('-lang ');
        let toSay = messageSplit[0]
        let audioUrls = googleTTS.getAllAudioUrls(toSay, {
            lang: messageSplit[1] ?? "en",
            slow: false,
            host: 'https://translate.google.com',
        });
        let memberChannel = message.member.voice.channel;
        if(!memberChannel) return message.channel.send("You must be in a voice channel to use this command!")
        const voiceConnection = await memberChannel.join();
        const audioDispatcher = voiceConnection.play(audioUrls[0].url);
        audioDispatcher.on('finish', () => {
            audioUrls.shift();
            if(audioUrls.length === 0) return message.channel.send("Finished playing!");
            voiceConnection.play(audioUrls[0].url)
        })
    }
}