//Start imports
const {TOKEN, prefix} = require( './config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
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
        guild.channels.cache.first().send("Hey! I'm **Siri**\nHow's it going!")
    }
})

//End body




//Footer code
client.login(TOKEN);
//End footer
