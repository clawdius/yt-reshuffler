import * as HTMLs from "./HTMLs.js";

import { stateVars, stateElements } from "./states.js";
import { assignSongsContainer } from "./handlers.js";

export function playerController(state, playingNow, embed) {
    const mcc = document.querySelector(`.music-container[data-id="${playingNow}"]`);

    switch (state) {
        case 1: {
            // Pausing a played video
            embed ? null : player.pauseVideo();

            mcc.removeChild(mcc.lastElementChild);
            mcc.insertAdjacentHTML("beforeend", embed ? HTMLs.pauseHTML : HTMLs.playHTML);

            embed ? window.playlistAPI.changeWindowTitle(`Now Playing - ${mcc.dataset.title}`) : window.playlistAPI.changeWindowTitle(`YT-Reshuffler - ${stateVars.playlistSettings.playlistName}`);

            break;
        }
        case 2: {
            // Playing a paused / stopped video
            embed ? null : player.playVideo();

            mcc.removeChild(mcc.lastElementChild);
            mcc.insertAdjacentHTML("beforeend", embed ? HTMLs.playHTML : HTMLs.pauseHTML);

            embed ? window.playlistAPI.changeWindowTitle(`YT-Reshuffler - ${stateVars.playlistSettings.playlistName}`) : window.playlistAPI.changeWindowTitle(`Now Playing - ${mcc.dataset.title}`);

            break;
        }
    }
}

export function changePlayer(musicContainer) {
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
        playerController(player.getPlayerState(), stateVars.playingNow, false);
    }

    // Change music
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

        player.loadVideoById(musicContainer.dataset.id);
        player.playVideo();
    }
}

export async function loadPlaylist(name) {
    let res = await window.playlistAPI.loadPlaylist(name);

    if (stateElements.playlistContainer.innerHTML != "") {
        stateElements.playlistContainer.innerHTML = "";
    }

    let musicContainer;
    let pos = 1;

    for (let s of res.songs) {
        // Not-so-hacky because I don't want to use `createElement`
        musicContainer = HTMLs.musicContainer(s.title, s.channel, s.id, pos);
        stateElements.playlistContainer.insertAdjacentHTML("beforeend", musicContainer);
        pos++;
    }

    // Assign containers every playlist load
    assignSongsContainer();
}

function getCurrentMusicPosition() {
    let pos = 0;

    while(true) {
        if(stateVars.songs[pos].dataset.id == stateVars.playingNow) {
            return pos;
        }

        pos++;
    }
}

export function playNext() {
    let curr = getCurrentMusicPosition();
    curr == stateVars.songs.length-1 ? curr = -1 : curr;
    changePlayer(stateVars.songs[curr+1])
}
