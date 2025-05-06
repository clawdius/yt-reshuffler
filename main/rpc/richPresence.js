const { Client } = require("@xhayper/discord-rpc");

async function createDiscordClient() {
    // God forbid I expose this client ID
    const cred = "888400543461019658";

    const rpc = new Client({
        clientId: cred,
    });

    return rpc
        .login()
        .then(() => {
            console.log(`[DPRESENCE] Rich Presence established`);
            return rpc;
        })
        .catch((e) => {
            console.log(`[DPRESENCE] Error:`, e);
            return null;
        });
}

module.exports = {
    createDiscordClient,
};
