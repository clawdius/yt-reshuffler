const { Client } = require("@xhayper/discord-rpc");

async function createDiscordClient() {
    const cred = global.config.discordClientId;

    const rpc = new Client({
        clientId: cred,
    });

    return rpc
        .login()
        .then(() => {
            console.log(`[DiscordPresence] Rich Presence Established`);
            return rpc;
        })
        .catch((e) => {
            console.log(`[DiscordPresence] Error:`, e);
            return null;
        });
}

module.exports = {
    createDiscordClient,
};
