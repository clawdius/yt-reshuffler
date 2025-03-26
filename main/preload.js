const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("v", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
});

contextBridge.exposeInMainWorld("playlistAPI", {
    loadPlaylist: (name) => ipcRenderer.invoke("load-playlist", name)
})