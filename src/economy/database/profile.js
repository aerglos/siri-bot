async function getOrMakeProfile(userId) {
    let { postgresClient } = require('../../../index');
    let responseArray = (await postgresClient.query(`SELECT * FROM economyusers WHERE user_id = '${userId}'`)).rows ;
    if(responseArray.length === 0) {
        await postgresClient.query(`INSERT INTO economyusers VALUES ('${userId}', 0, 0)`);
        return getOrMakeProfile(userId);
    } else {
        return responseArray[0];
    }
}
module.exports = {
    getOrMakeProfile
}