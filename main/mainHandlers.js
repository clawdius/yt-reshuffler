const { ipcMain } = require("electron/main");
const playlistUtils = require("./utils/PlaylistUtils");

function setupMainHandlers(handlersData) {

    ipcMain.handle("get-last-playlist", async (e) => {
        return await playlistUtils.getLastPlaylist()
    })

    ipcMain.handle("load-playlist", async (e, name) => {
        return await playlistUtils.loadPlaylist(name);
    });

    ipcMain.handle("change-window-title", (e, title) => {
        handlersData.mainWindow.title = title;
        return title;
    });

    ipcMain.handle("shuffle-playlist", async (e, name) => {
        const playlist = await playlistUtils.loadPlaylist(name);
        const shuffled = await playlistUtils.shufflePlaylist(playlist);
        await playlistUtils.savePlaylist(name, shuffled);

        return name;
    })
}

module.exports = {
    setupMainHandlers,
};
