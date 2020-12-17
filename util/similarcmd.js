const stringSim = require('string-similarity');
function findSimCmd(cmdCol, reqCmd) {
    let ratingsObj = stringSim.findBestMatch(reqCmd, cmdCol.keyArray());
    return ratingsObj.bestMatch.target;
}

module.exports = {findSimCmd}