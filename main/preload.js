const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("playlistSettings", {
    getLastPlaylist: () => ipcRenderer.invoke("get-last-playlist") 
});

contextBridge.exposeInMainWorld("playlistAPI", {
    loadPlaylist: (name) => ipcRenderer.invoke("load-playlist", name),
    changeWindowTitle: (title) => ipcRenderer.invoke("change-window-title", title),
    shufflePlaylist: (name) => ipcRenderer.invoke("shuffle-playlist", name)
})