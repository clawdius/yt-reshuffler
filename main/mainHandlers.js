const { ipcMain } = require("electron/main");
const playlistUtils = require("./utils/playlistUtils");
const { rpcSetActivity } = require("./rpc/richPresenceUtils");
const { appLogger } = require("./utils/loggerSettings");

function setupMainHandlers(handlersData) {
    ipcMain.handle("get-last-playlist", async (e) => {
        return await playlistUtils.getLastPlaylist();
    });

    ipcMain.handle("get-settings-value", async (e) => {
        return global.config;
    });

    ipcMain.handle("load-playlist", async (e, name) => {
        return await playlistUtils.loadPlaylist(name).catch((e) => {
            if (e) appLogger.error("Error loading playlist!");
        });
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
    });

    ipcMain.handle("fetch-data-from-YT", async (e, id) => {
        return await playlistUtils.fetchDataFromYT(id);
    });

    // If `useDiscord` == true, create presence handler
    if (global.config.useDiscord) {
        ipcMain.handle("set-activity", (e, frontPayLoad) => {
            if (handlersData.rpc) return rpcSetActivity(handlersData, frontPayLoad);
        });
    }
}

module.exports = {
    setupMainHandlers,
};
