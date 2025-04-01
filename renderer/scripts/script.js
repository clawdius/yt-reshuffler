import * as HTMLs from "./HTMLs.js";

import { stateVars, stateElements } from "./states.js";

function playerController(state, playingNow) {

    const mcc = document.querySelector(`.music-container[data-id="${playingNow}"]`);

    switch (state) {
        case 1: {
            // Pausing a played video
            player.pauseVideo();

            mcc.removeChild(mcc.lastElementChild);
            mcc.insertAdjacentHTML("beforeend", HTMLs.playHTML);

            window.playlistAPI.changeWindowTitle(`YT-Reshuffler - ${stateVars.playlistSettings.playlistName}`);

            break;
        }
        case 0:
        case 2: {
            // Playing a paused / stopped video
            player.playVideo();

            mcc.removeChild(mcc.lastElementChild);
            mcc.insertAdjacentHTML("beforeend", HTMLs.pauseHTML);

            window.playlistAPI.changeWindowTitle(`Now Playing - ${mcc.dataset.title}`);

            break;
        }
    }
}

function changePlayer(id, musicContainer) {
    // Adjust width for the first time
    if (stateElements.leftColumn.classList.contains("w-0") && stateElements.rightColumn.classList.contains("w-full")) {
        stateElements.leftColumn.classList.add("w-2/5", "pl-5");
        stateElements.leftColumn.classList.remove("w-0");

        stateElements.rightColumn.classList.add("w-3/5", "pl-3", "pr-5");
        stateElements.rightColumn.classList.remove("w-full", "px-5");
    }

    if (stateVars.playingNow != null) {
        stateVars.playingBefore = stateVars.playingNow;
    }

    stateVars.playingNow = musicContainer.dataset.id;

    if (stateVars.playingNow == stateVars.playingBefore) {
        playerController(playerState, stateVars.playingNow);
    }

    if (stateVars.playingBefore != stateVars.playingNow) {
        // Add pauseIcon to the current playing song
        const mcc = document.querySelector(`.music-container[data-id="${stateVars.playingNow}"]`);
        mcc.insertAdjacentHTML("beforeend", HTMLs.pauseHTML);

        // Remove the pauseIcon on previous song
        if (stateVars.playingBefore != null) {
            const mcb = document.querySelector(`.music-container[data-id="${stateVars.playingBefore}"]`);
            mcb.removeChild(mcb.lastElementChild);
        }

        window.playlistAPI.changeWindowTitle(`Now Playing - ${musicContainer.dataset.title}`);

        player.loadVideoById(id);
        player.playVideo();
    }
}

function search(n) {
    if (n != "") {
        let name = n.toLowerCase();
        for (let d of stateVars.songs) {
            if (!d.dataset.title.toLowerCase().includes(name)) {
                d.classList.add("hidden");
            } else {
                d.classList.remove("hidden");
            }
        }
    } else {
        for (let d of stateVars.songs) {
            d.classList.remove("hidden");
        }
    }
}

function assignSongsContainer() {
    stateVars.songs = document.querySelectorAll(".music-container");

    for (let s of stateVars.songs) {
        s.addEventListener("click", (e) => {
            changePlayer(s.dataset.id, e.currentTarget);
        });
    }
}

function assignButtonsHandler() {
    // Fetcher
    const fetcher = document.querySelector("#fetchBtn");

    // Prevent multiple clicks when fetching
    async function fetcherHandler() {
        fetcher.removeEventListener("click", fetcherHandler);
        await window.playlistAPI.fetchDataFromYT(stateVars.playlistSettings.playlistID);
        await loadPlaylist(stateVars.playlistSettings.playlistName).then(() => {
            fetcher.addEventListener("click", fetcherHandler)
        });
    }
    fetcher.addEventListener("click", fetcherHandler);

    // Search
    const searchInput = document.querySelector("input#search");
    searchInput.addEventListener("keyup", (e) => {
        let searchInput = debounce(search, 200);
        searchInput(e.target.value);
    });

    // Reshuffler
    const reshuffler = document.querySelector("#reshuffleBtn");
    reshuffler.addEventListener("click", async () => {
        let shuffledName = await window.playlistAPI.shufflePlaylist(stateVars.playlistSettings.playlistName);
        await loadPlaylist(shuffledName);

        stateVars.playingBefore = null;
        stateVars.playingNow = null;

        // Resets column width
        if (stateElements.leftColumn.classList.contains("w-2/5") && stateElements.rightColumn.classList.contains("w-3/5")) {
            stateElements.leftColumn.classList.remove("w-2/5", "pl-5");
            stateElements.leftColumn.classList.add("w-0");

            stateElements.rightColumn.classList.remove("w-3/5", "pl-3", "pr-5");
            stateElements.rightColumn.classList.add("w-full", "px-5");
        }

        // Resets search
        searchInput.value = "";

        player.pauseVideo();
    });
}

async function loadPlaylist(name) {
    let res = await window.playlistAPI.loadPlaylist(name);

    if (stateElements.playlistContainer.innerHTML != "") {
        stateElements.playlistContainer.innerHTML = "";
    }

    let musicContainer;

    for (let s of res.songs) {
        // Not-so-hacky because I don't want to use `createElement`
        musicContainer = HTMLs.musicContainer(s.title, s.channel, s.id);
        stateElements.playlistContainer.insertAdjacentHTML("beforeend", musicContainer);
    }

    // Assign containers every playlist load
    assignSongsContainer();
}

// Utils

function debounce(f, d) {
    let timer;
    return function (...a) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            f.apply(this, a);
        }, d);
    };
}

function assignCustomShortcuts() {
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key == "f") {
            document.querySelector("input#search").focus();
        }

        if (e.key == " " && document.activeElement != document.querySelector("input#search")) {
            e.preventDefault();
            if (stateVars.playingNow != null) {
                playerController(playerState, stateVars.playingNow);
            }
        }
    });
}

async function startUp() {
    const last = await window.playlistSettings.getLastPlaylist();

    stateVars.playlistSettings = {
        playlistName: last.lastPlaylistName,
        playlistID: last.lastPlaylistID,
    };

    const title = document.querySelector("#playlistTitle");
    title.innerHTML = stateVars.playlistSettings.playlistName;

    window.playlistAPI.changeWindowTitle(`YT-Reshuffler - ${stateVars.playlistSettings.playlistName}`);
}

window.onload = async () => {
    await startUp();
    await loadPlaylist(stateVars.playlistSettings.playlistName);

    assignButtonsHandler();
    assignCustomShortcuts();
};
