const { ipcMain } = require("electron/main");
const playlistUtils = require("./utils/playlistUtils");

function setupMainHandlers(handlersData) {

    ipcMain.handle("get-last-playlist", async (e) => {
        return await playlistUtils.getLastPlaylist()
    })

    ipcMain.handle("get-settings-value", async (e) => {
        return global.config
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
        playlist.songs = await playlistUtils.shufflePlaylist(playlist.songs);

        await playlistUtils.savePlaylist(name, playlist);
        return name;
    })

    ipcMain.handle("fetch-data-from-YT", async (e, id) => {
        return await playlistUtils.fetchDataFromYT(id);
    })
}

module.exports = {
    setupMainHandlers,
};
