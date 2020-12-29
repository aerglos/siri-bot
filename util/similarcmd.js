const stringSim = require('string-similarity');
function findSimCmd(cmdCol, reqCmd) {
    console.log("Searching for sim command....")
    let ratingsObj = stringSim.findBestMatch(reqCmd, cmdCol.keyArray());
    return ratingsObj.bestMatch.target;
}

module.exports = {findSimCmd}