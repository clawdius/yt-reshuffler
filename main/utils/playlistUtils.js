const fs = require("fs").promises;

async function assemblePlaylist(raw) {
    let cleanList = [];

    for (let d of raw.items) {
        cleanList.push({
            "title": d.snippet.title,
            "channel": d.snippet.videoOwnerChannelTitle,
            "id": d.snippet.resourceId.videoId,
        });
    }

    return cleanList;
}

async function shufflePlaylist(list) {
    let shuffled = [],
        r;

    while (list.length != 0) {
        r = Math.floor(Math.random() * list.length);
        shuffled.push(list[r]);
        list.splice(r, 1);
    }

    return shuffled;
}

async function savePlaylist(name, list) {
    // Name will be changed according to playlist name
    name = "analogous";

    await fs.writeFile(`./playlists/${name}-shuffled.json`, JSON.stringify(list, null, 2));
}

async function loadPlaylist(name) {
    return JSON.parse(await fs.readFile(`./playlists/${name}-shuffled.json`));
}

async function getLastPlaylist() {
    return JSON.parse(await fs.readFile(`./playlists/playlist-settings.json`)).lastPlaylist;
}

module.exports = {
    assemblePlaylist,
    shufflePlaylist,
    savePlaylist,
    loadPlaylist,
    getLastPlaylist
};
