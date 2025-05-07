const { Client } = require("@xhayper/discord-rpc");
const { apiLogger } = require("../utils/loggerSettings");

async function createDiscordClient() {
    // God forbid I expose this client ID
    const cred = "888400543461019658";

    const rpc = new Client({
        clientId: cred,
    });

    return rpc
        .login()
        .then(() => {
            apiLogger.info("Discord presence established", { type: "RPC" });
            return rpc;
        })
        .catch((e) => {
            apiLogger.error(e, { type: "RPC" });
            return null;
        });
}

module.exports = {
    createDiscordClient,
};
