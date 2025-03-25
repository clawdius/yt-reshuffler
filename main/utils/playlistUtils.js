const fs = require("fs");

// Gotta do the youtube API fetch assembly thing
let rawPlaylist = JSON.parse(fs.readFileSync("./playlists/raw-playlist.json"));

async function playlistAssembler(raw) {
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

async function playlistShuffler(list) {
    let shuffled = [], r;

    while (list.length != 0) {
        r = Math.floor(Math.random() * list.length)
        shuffled.push(list[r]);
        list.splice(r, 1);
    }

    return shuffled;
}

async function savePlaylist(name, list) {
    // Name will be changed according to playlist name
    let name = "Analogous";

    fs.writeFile(`./playlists/${name}-shuffled.json`, JSON.stringify(list, null, 2), (e) => {
        if (e) throw e;
    })
}

module.exports = {
    playlistAssembler,
    playlistShuffler,
    savePlaylist
};
