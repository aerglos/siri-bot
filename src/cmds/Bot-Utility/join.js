module.exports = {
    name: "join",
    description: "Dev CMD",
    args: true,
    usage: "join [leave/join (true/false)]",
    execute(message, args) {
        let userVc = message.member.voice.channel;
        let joinOrLeave = (args[0] == 'true');
        if(userVc) {
            try {
                if(joinOrLeave) {
                    userVc.join();
                } else {
                    userVc.leave();
                }
            } catch (e) {
                message.channel.send("Something went wrong - or I couldn't join the VC ):<")
            }
        } else {
            message.channel.send("You must be in a VC to do this.")
        }
    }
}