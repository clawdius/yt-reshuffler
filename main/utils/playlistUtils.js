const fs = require("fs").promises;

async function fetchDataFromYT(id) {
    let playlist = {};

    // Fetch playlist info

    const resInfo = await fetch(`https://www.googleapis.com/youtube/v3/playlists?key=${global.config.key}&part=snippet&id=${id}`);
    const info = await resInfo.json();

    playlist.metadata = {
        name: info.items[0].snippet.title,
        playlistId: info.items[0].id,
    };

    // Fetch playlist items

    let urlAPI = `https://www.googleapis.com/youtube/v3/playlistItems?key=${global.config.key}&part=snippet&playlistId=${id}&maxResults=50`;
    let nextPage = ``;

    let cleanItems = [];
    let counter = 1;

    while (true) {
        const resItems = await fetch(urlAPI + nextPage);
        const songs = await resItems.json();

        for (let d of songs.items) {
            cleanItems.push({
                "title": d.snippet.title,
                "channel": d.snippet.videoOwnerChannelTitle == undefined ? "Deleted Video" : d.snippet.videoOwnerChannelTitle.includes("Release - Topic") ? "Various Artists" : d.snippet.videoOwnerChannelTitle,
                "id": d.snippet.resourceId.videoId,
                "thumbnail": d.snippet.thumbnails.maxres ? true : false,
            });
        }

        console.log(`Fetching playlist items from Youtube (${counter})`);

        if (!songs.nextPageToken) {
            playlist.metadata.count = songs.pageInfo.totalResults;
            console.log(`Done fetching ${playlist.metadata.count} songs`);
            break;
        }

        nextPage = `&pageToken=${songs.nextPageToken}`;
        counter++;
    }

    playlist.songs = await shufflePlaylist(cleanItems);
    return await savePlaylist(playlist.metadata.name, playlist);
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

async function savePlaylist(name, playlist) {
    return await fs.writeFile(`./playlists/${name}-shuffled.json`, JSON.stringify(playlist, null, 2));
}

async function loadPlaylist(name) {
    return JSON.parse(await fs.readFile(`./playlists/${name}-shuffled.json`));
}

async function getLastPlaylist() {
    return JSON.parse(await fs.readFile(`./conf/playlistSettings.json`));
}

module.exports = {
    fetchDataFromYT,
    shufflePlaylist,
    savePlaylist,
    loadPlaylist,
    getLastPlaylist,
};
