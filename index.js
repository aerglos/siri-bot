//Start imports
const { prefix} = require( './config.json');
const Discord = require('discord.js');
const MusicClient = require('./structure/MusicClient');
const client = new MusicClient();
const { readCmds } = require('./util/readcmds');
const  {findSimCmd} = require('./util/similarcmd');
//End imports

//CMD handling
client.commandCollection = new Discord.Collection();
readCmds(client.commandCollection, './src/cmds')

//Cooldown Handling
const cooldowns = new Discord.Collection();


//Body
client.once('ready', () => {
    console.log('READY');
})

client.on('message', (message) => {
    if(message.channel.id === "753683863175299072") {
        if(message.content.startsWith("[SUGGESTION]")) {
            message.react("<:halal:751174121655894136>");
            message.react("<:haram:751174164303446137>");
        } else if(message.content.startsWith("[INFO]") && (message.member.permissions.has("MANAGE_GUILD") || message.member.roles.cache.has("801309669343494144"))) {
            message.react("ℹ️");
        } else {
            message.delete();
        }
    }
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const requestedCommand = args.shift().toLowerCase();
    const command = client.commandCollection.get(requestedCommand)


    if(!command) {
        message.channel.send(`I can't find that command, maybe you mean \`${findSimCmd(client.commandCollection, requestedCommand)}\``);
        return;
    }
    if(!args && command.args) {
        message.channel.send(`This command requires arguments. The proper usage is ${command.usage}`);
        return;
    }
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch(error) {
        message.channel.send("The command encountered an execution error D:");
        console.log(error);
    }
}
)

client.on('guildCreate', (guild) => {
    if(guild.id === "750874436928012289") {
        guild.channels.cache.find(chan => chan.name === "onion").send("Hey! I'm Siri, the multi-purpose bot for Cipollahouse. Currently in development by Chase!")
    } else {
        guild.channels.cache.find(chan => chan.type === "text").send("Hey! I'm **Siri**\nHow's it going! Run `$help` to see my commands!")
    }
})

client.on('guildMemberAdd', (member) => {
    let memberGuild = member.guild
    let welcomeEmbed = new Discord.MessageEmbed()
        .setTitle(`Welcome ${member.displayName}!`)
        .setDescription(`Welcome to ${memberGuild.name}, ${member}. Enjoy your stay!`)
        .setColor("RANDOM")
        .setAuthor(member.displayName, member.user.displayAvatarURL())
    if(memberGuild.id === "798306159987261502") {
        memberGuild.channels.cache.find(c=> c.id === "798316099724247040").send(welcomeEmbed)
        member.roles.add(memberGuild.roles.cache.find(r => r.name === "Player"))
    }
})

//End body




//Footer code
client.login(process.env.TOKEN);
//End footer
