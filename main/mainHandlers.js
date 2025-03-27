const { ipcMain } = require("electron/main");
const playlistUtils = require("./utils/PlaylistUtils");

function setupMainHandlers() {
    ipcMain.handle("load-playlist", async (e, name) => {
        let results = await playlistUtils.loadPlaylist(name);
        return results;
    });

    ipcMain.handle("change-window-title", (e, title) => {
        win.title = title;
    });
}

module.exports = {
    setupMainHandlers,
};
