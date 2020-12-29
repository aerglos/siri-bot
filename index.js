//Start imports
const {TOKEN, prefix} = require( './config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const { readCmds } = require('./util/readcmds');
const  {findSimCmd} = require('./util/similarcmd');
//End imports

//CMD handling
let commandCollection = new Discord.Collection();
readCmds(commandCollection, './src/cmds')

//Body
client.once('ready', () => {
    console.log('READY');
})

client.on('message', (message) => {
    if(!message.content.toLowerCase().startsWith(prefix)) return;
    if(message.author.bot && message.author.id !== "786839357062774794") return;
    let requestedCmd = message.content.toLowerCase().replace(prefix, '');
    let args = message.content.toLowerCase().replace(`${requestedCmd} `, '').split(' ')
    if(!commandCollection.has(requestedCmd)) return message.channel.send(`I didn't quite understand that, maybe you meant \`${findSimCmd(commandCollection, requestedCmd)}\``).then(msg => {});
    let reqCmdFile = require(commandCollection.get(requestedCmd))
    if(reqCmdFile.args && !args) return message.channel.send(`This command requires arguments - the proper usage is \`${reqCmdFile.usage}\``)
    reqCmdFile.execute(message, args, commandCollection);
})
//End body




//Footer code
client.login(TOKEN);
//End footer
