const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("v", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
});
