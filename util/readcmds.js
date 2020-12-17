const recI = require('recursive-readdir');
function readCmds(coll, cmdPath) {
    recI(cmdPath,  (err, files) => {
        files.forEach((cmdPath) => {
            let cmdName = require(`../${cmdPath}`).name;
            if(!cmdName) return console.log(`The file at path ${cmdPath} has broke, please check it out!`)

            coll.set(cmdName, "./" + cmdPath);
        })
    })
}
module.exports = { readCmds }