import * as HTMLs from "./HTMLs.js";
import { changeLayout, jumpTo, search } from "./utils.js";

import { stateVars, stateElements } from "./states.js";
import { assignSongsContainer } from "./handlers.js";

export function playerController(state, playingNow, embed) {
    const mcc = document.querySelector(`.music-container[data-id="${playingNow}"]`);
    const mci = document.querySelector(`.music-container[data-id="${playingNow}"] img`);
    const scc = document.querySelector(`#controlState img`);

    if (stateVars.playingNow != null) {
        switch (state) {
            case 1: {
                // Pausing a played video
                embed ? null : player.pauseVideo();

                mci.src = embed ? "/renderer/assets/pause-icon.svg" : "/renderer/assets/play-icon.svg"
                scc.src = "/renderer/assets/pause-icon.svg"

                embed ? window.playlistAPI.changeWindowTitle(`Now Playing - ${mcc.dataset.title}`) : window.playlistAPI.changeWindowTitle(`YT-Reshuffler - ${stateVars.playlistSettings.playlistName}`);

                break;
            }
            case 3:
            case 2: {
                // Playing a paused / stopped video
                embed ? null : player.playVideo();

                mci.src = embed ? "/renderer/assets/play-icon.svg" : "/renderer/assets/pause-icon.svg"
                scc.src = "/renderer/assets/play-icon.svg"

                embed ? window.playlistAPI.changeWindowTitle(`YT-Reshuffler - ${stateVars.playlistSettings.playlistName}`) : window.playlistAPI.changeWindowTitle(`Now Playing - ${mcc.dataset.title}`);

                break;
            }
        }
    }
}

export function changePlayer(musicContainer) {
    // Adjust width for the first time
    changeLayout("active");

    if (stateVars.playingNow != null) {
        stateVars.playingBefore = stateVars.playingNow;
    }

    // Get playingNow
    stateVars.playingNow = musicContainer.dataset.id;

    if (stateVars.playingNow == stateVars.playingBefore) {
        playerController(player.getPlayerState(), stateVars.playingNow, false);
    }

    // Change music
    if (stateVars.playingBefore != stateVars.playingNow) {
        // Add pauseIcon to the current playing song
        const mcc = document.querySelector(`.music-container[data-id="${stateVars.playingNow}"]`);
        mcc.insertAdjacentHTML("beforeend", HTMLs.stateIcon("mini", "pause"));

        stateElements.info.innerHTML = `${mcc.dataset.pos}. ${mcc.dataset.title}`

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

    // Assign containers function every playlist load
    assignSongsContainer();
}

export async function resetPlaylist(name) {
    await loadPlaylist(name);

    stateVars.playingBefore = null;
    stateVars.playingNow = null;

    // Resets column width
    changeLayout("reset");

    // Resets search
    stateElements.searchInput.value = "";
    search("");

    // Resets info
    stateElements.info.innerHTML = ""

    // Scroll to first music
    jumpTo(1, "smooth")

    player.pauseVideo();
}

export function getCurrentMusicPosition() {
    let pos = 0;

    while (true) {
        if (stateVars.songs[pos].dataset.id == stateVars.playingNow) {
            return pos;
        }

        pos++;
    }
}

export function playNext() {
    if (stateVars.playingNow != null) {
        let curr = getCurrentMusicPosition();
        curr == stateVars.songs.length - 1 ? (curr = -1) : curr;
        changePlayer(stateVars.songs[curr + 1]);
    }
}

export function playPrevious() {
    if (stateVars.playingNow != null) {
        // Play previous when the current time is under 3 secs, otherwise, resets the music
        if (Math.floor(player.getCurrentTime() <= 3)) {
            let curr = getCurrentMusicPosition();
            curr == 0 ? (curr = stateVars.songs.length) : curr;
            changePlayer(stateVars.songs[curr - 1]);
        } else {
            player.seekTo(0);
        }
    }
}

export function randomizer() {
    const rIndex = Math.floor(Math.random() * (stateVars.songs.length - 1))
    return changePlayer(stateVars.songs[rIndex]);
}
