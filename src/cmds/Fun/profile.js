const getProfile = require('../../economy/database/profile');
module.exports = {
    name: "profile",
    description: "Get your cipollahouse profile",
    args: false,
    usage: "profile [user]",
    cooldown: 3,
    async execute(message, args) {
        const profileObject = await getProfile(message, args);

    }
}