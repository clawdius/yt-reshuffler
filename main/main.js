const { app, BrowserWindow, ipcMain } = require("electron/main");
const fs = require("fs").promises;
const { spawn } = require("child_process");
const path = require("node:path");
const playlistUtils = require("./utils/PlaylistUtils");

let server;
let port;

const createMainWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        resizable: false,
    });

    win.setAutoHideMenuBar(true);

    win.loadURL(`http://localhost:${port}/renderer/pages/main.html`);
};

app.whenReady().then(async () => {
    port = JSON.parse(await fs.readFile("./conf/settings.json")).port;

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
        }
    });
});

app.on("window-all-closed", () => {
    console.log("Exiting app & turning off express");
    server.kill();
    app.quit();
});

ipcMain.handle("load-playlist", async (e, name) => {
    let results = await playlistUtils.loadPlaylist(name);
    return results;
});
