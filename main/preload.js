const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("playlistSettings", {
    getLastPlaylist: () => ipcRenderer.invoke("get-last-playlist"),
    getSettingsValue: () => ipcRenderer.invoke("get-settings-value"),
});

contextBridge.exposeInMainWorld("playlistAPI", {
    loadPlaylist: (name) => ipcRenderer.invoke("load-playlist", name),
    changeWindowTitle: (title) => ipcRenderer.invoke("change-window-title", title),
    shufflePlaylist: (name) => ipcRenderer.invoke("shuffle-playlist", name),
    fetchDataFromYT: (id) => ipcRenderer.invoke("fetch-data-from-YT", id),
});

// Register discord API
contextBridge.exposeInMainWorld("richPresence", {
    setActivity: (data) => ipcRenderer.invoke("set-activity", data),
});
