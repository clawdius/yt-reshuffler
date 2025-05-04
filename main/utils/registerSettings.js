const fs = require("fs").promises;

global.config = {}

async function registerSettings() {
    // Registers settings value to global object
    const settings = JSON.parse(await fs.readFile("././conf/appSettings.json"));

    // Backend Settings
    global.config.port = settings.port;
    global.config.key = settings.keyYT;

    // App Settings
    global.config.backgroundColor = settings.backgroundColor;

    // Experimental RPC
    if(settings.useDiscord) {
        global.config.useDiscord = settings.useDiscord;
        global.config.discordClientId = settings.keyDC;
    }
}

module.exports = {
    registerSettings,
};
