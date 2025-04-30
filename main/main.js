const { app, BrowserWindow } = require("electron/main");
const { spawn } = require("child_process");
const path = require("node:path");

const { setupMainHandlers } = require("./mainHandlers.js");
const { registerSettings } = require("./utils/registerSettings.js");

let server,
    handlersData = {};

const createMainWindow = () => {
    win = new BrowserWindow({
        width: 960,
        height: 660,
        icon: path.join(__dirname, "../icon.png"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        resizable: false,
    });

    // Bundle the win object to the handlers
    handlersData.mainWindow = win;

    win.setAutoHideMenuBar(true);

    win.loadURL(`http://localhost:${global.config.port}/renderer/pages/main.html`);
};

app.whenReady().then(async () => {

    // Register settings to `global.config`
    await registerSettings();

    // Create express server instance
    server = spawn("node", ["main/server/server.js"], {
        detached: false,
        stdio: ["ignore", "pipe", "pipe"],
    });

    server.stdout.on("data", (d) => {
        console.log(`[SERVER] ${d.toString().trim()}`);

        if (d.includes("Server started!")) {
            console.log("Creating main window");
            createMainWindow();

            console.log("Registering handlers");
            setupMainHandlers(handlersData);
        }
    });
});

app.on("window-all-closed", () => {
    console.log("Exiting app & turning off express");
    server.kill();
    app.quit();
});
