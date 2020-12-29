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

//Body
client.once('ready', () => {
    console.log('READY');
})

client.on('message', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(!client.commandCollection.get(command)) {
        message.channel.send(`I can't find that command, maybe you mean \`${findSimCmd(client.commandCollection, command)}\``);
        return;
    }
    if(!args && client.commandCollection.get(command).args) {
        message.channel.send(`This command requires arguments. The proper usage is ${client.commandCollection.get(command).usage}`);
        return;
    }
    try {
        client.commandCollection.get(command).execute(message, args);
    } catch(error) {
        message.channel.send("The command encountered an execution error D:");
    }
}
)

client.on('guildCreate', (guild) => {
    if(guild.id === "750874436928012289") {
        guild.channels.cache.find(chan => chan.name === "onion").send("Hey! I'm Siri, the multi-purpose bot for Cipollahouse. Currently in development by Chase!")
    }
})

//End body




//Footer code
client.login(TOKEN);
//End footer
