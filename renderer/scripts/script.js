import * as HTMLs from "./HTMLs.js";

let playingNow = null,
    playingBefore = null,
    playlistSettings = {};

const playlistContainer = document.querySelector("#playlist");

function playerController(state, playingNow) {
    const mcc = document.querySelector(`.music-container[data-id="${playingNow}"]`);

    switch (state) {
        case 1: {
            // Pausing a played video
            player.pauseVideo();

            mcc.removeChild(mcc.lastElementChild);
            mcc.insertAdjacentHTML("beforeend", HTMLs.pauseHTML);

            window.playlistAPI.changeWindowTitle(`YT-Reshuffler`);

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
        let shuffledName = await window.playlistAPI.shufflePlaylist(playlistSettings.lastPlaylist);
        await loadPlaylist(shuffledName);
    });
}

async function loadPlaylist(name) {
    let songs = await window.playlistAPI.loadPlaylist(name);

    if (playlistContainer.innerHTML != "") {
        playlistContainer.innerHTML = "";
    }

    let musicContainer;

    for (let s of songs) {
        // Not-so-hacky because I don't want to use `createElement`
        musicContainer = HTMLs.musicContainer(s.title, s.channel, s.id);
        playlistContainer.insertAdjacentHTML("beforeend", musicContainer);
    }

    // Assign containers every playlist load
    assignSongsContainer()
}

async function startUp() {
    playlistSettings = {
        lastPlaylist: await window.playlistSettings.getLastPlaylist(),
    };

    window.playlistAPI.changeWindowTitle(`YT-Reshuffler`);
}

window.onload = async () => {
    await startUp();
    await loadPlaylist(playlistSettings.lastPlaylist);

    assignButtonsHandler();
};
