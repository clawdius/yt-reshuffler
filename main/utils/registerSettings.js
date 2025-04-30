const fs = require("fs").promises;

global.config = {}

async function registerSettings() {
    // Registers settings value to global object
    const settings = JSON.parse(await fs.readFile("././conf/appSettings.json"));

    // Backend Settings
    global.config.port = settings.port;
    global.config.key = settings.key;

    // App Settings
    global.config.backgroundColor = settings.backgroundColor;
}

module.exports = {
    registerSettings,
};
