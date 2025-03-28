import * as HTMLs from "./HTMLs.js";

let playingNow = null,
    playingBefore = null,
    playlistSettings = {};

const playlistContainer = document.querySelector("#playlist"),
    leftColumn = document.querySelector("#leftColumn"),
    rightColumn = document.querySelector("#rightColumn");

function playerController(state, playingNow) {
    const mcc = document.querySelector(`.music-container[data-id="${playingNow}"]`);

    switch (state) {
        case 1: {
            // Pausing a played video
            player.pauseVideo();

            mcc.removeChild(mcc.lastElementChild);
            mcc.insertAdjacentHTML("beforeend", HTMLs.pauseHTML);

            window.playlistAPI.changeWindowTitle(`YT-Reshuffler - ${playlistSettings.playlistName}`);

            break;
        }
        case 2: {
            // Playing a paused video
            player.playVideo();

            mcc.removeChild(mcc.lastElementChild);
            mcc.insertAdjacentHTML("beforeend", HTMLs.playHTML);

            window.playlistAPI.changeWindowTitle(`Now Playing - ${mcc.dataset.title}`);

            break;
        }
        default: {
            console.log("no info");
        }
    }
}

function changePlayer(id, musicContainer) {
    
    // Adjust width for the first time
    if(leftColumn.classList.contains("w-0") && rightColumn.classList.contains("w-full")){
        leftColumn.classList.add("w-2/5", "pl-5");
        leftColumn.classList.remove("w-0");

        rightColumn.classList.add("w-3/5", "pl-3", "pr-5");
        rightColumn.classList.remove("w-full", "px-5");
    }

    if (playingNow != null) {
        playingBefore = playingNow;
    }
    playingNow = musicContainer.dataset.id;

    if (playingNow == playingBefore) {
        playerController(state, playingNow);
    }

    if (playingBefore != playingNow) {
        // Add playArrow to the current playing song
        document.querySelector(`.music-container[data-id="${playingNow}"]`).insertAdjacentHTML("beforeend", HTMLs.playHTML);

        // Remove the playArrow on previous song
        if (playingBefore != null) {
            const mcb = document.querySelector(`.music-container[data-id="${playingBefore}"]`);
            mcb.removeChild(mcb.lastElementChild);
        }

        window.playlistAPI.changeWindowTitle(`Now Playing - ${musicContainer.dataset.title}`);

        player.loadVideoById(id);
        player.playVideo();
    }
}

function assignSongsContainer() {
    let songs = document.querySelectorAll(".music-container");
    for (let s of songs) {
        s.addEventListener("click", (e) => {
            changePlayer(s.dataset.id, e.currentTarget);
        });
    }
}

function assignButtonsHandler() {
    // Reshuffler
    const reshuffler = document.querySelector("#reshuffleBtn");
    reshuffler.addEventListener("click", async () => {
        let shuffledName = await window.playlistAPI.shufflePlaylist(playlistSettings.playlistName);
        await loadPlaylist(shuffledName);

        playingBefore = null;
        playingNow = null;

        player.pauseVideo();
    });

    const fetcher = document.querySelector("#fetchBtn");
    fetcher.addEventListener("click", async () => {
        await window.playlistAPI.fetchDataFromYT(playlistSettings.playlistID);
        await loadPlaylist(playlistSettings.playlistName);
    });
}

async function loadPlaylist(name) {
    let res = await window.playlistAPI.loadPlaylist(name);

    if (playlistContainer.innerHTML != "") {
        playlistContainer.innerHTML = "";
    }

    let musicContainer;

    for (let s of res.songs) {
        // Not-so-hacky because I don't want to use `createElement`
        musicContainer = HTMLs.musicContainer(s.title, s.channel, s.id);
        playlistContainer.insertAdjacentHTML("beforeend", musicContainer);
    }

    // Assign containers every playlist load
    assignSongsContainer();
}

async function startUp() {

    const last = await window.playlistSettings.getLastPlaylist()

    playlistSettings = {
        playlistName: last.lastPlaylistName,
        playlistID: last.lastPlaylistID
    };

    const title = document.querySelector("#playlistTitle");
    title.innerHTML = playlistSettings.playlistName;

    window.playlistAPI.changeWindowTitle(`YT-Reshuffler - ${playlistSettings.playlistName}`);
}

window.onload = async () => {
    await startUp();
    await loadPlaylist(playlistSettings.playlistName);

    assignButtonsHandler();
};
