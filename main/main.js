const { app, BrowserWindow, ipcMain } = require("electron/main");
const fs = require("fs");
const { spawn } = require("child_process");
const port = JSON.parse(fs.readFileSync("./conf/settings.json")).port;
const path = require("node:path");

console.log("Electron starts");

let server;

const createMainWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        resizable: false,
    });

    win.loadURL(`http://localhost:${port}/renderer/pages/main.html`);
};

app.whenReady().then(() => {
    // Create express server instance
    server = spawn("node", ["main/server/server.js"], {
        detached: false,
        stdio: ["ignore", "pipe", "pipe"]
    });

    server.stdout.on("data", (d) => {
        console.log(`[SERVER] ${d.toString().trim()}`);
    })

    createMainWindow();
});

app.on("window-all-closed", () => {
    console.log("All windows closed, exiting app & turning off express");
    server.kill();
    app.quit();
});
