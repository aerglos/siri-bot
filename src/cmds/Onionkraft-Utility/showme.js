module.exports = {
    name: "showme",
    description: "Show info for anything",
    args: true,
    usage: "showme [resource] {resourcearg1, resourcearg2, e.t.c.}",
    keywords: ["info", "showme"],
    execute(message, args) {
        let reqResource = args[0];
        message.channel.send(args);
        message.channel.send(`You requested the resource \`${reqResource}\`\nHere's what I found:`);
        switch(reqResource) {
            case 'mods':
                message.channel.send("The mods for this season so far include:\n. Da Vinci's vessels\n. Mr.Crayfishes Gun Mod\n. Quark");
                break;
            default:
                message.channel.send("Hmmm... I couldn't find anything!");
                break;
        }
    }
}
