import * as HTMLs from "./HTMLs.js";
import { changeLayout, jumpTo, resetSearch, getCurrentMusicPosition, channelCleaner } from "./utils.js";

import { stateVars, stateElements } from "./states.js";
import { assignSongsContainer } from "./main-handlers.js";

export function playerController(state, playingNow, embed) {
    const mcc = document.querySelector(`.music-container[data-id="${playingNow}"]`);
    const mci = document.querySelector(`.music-container[data-id="${playingNow}"] img`);
    const scc = document.querySelector(`#controlState img`);

    const defWinTitle = `YT-Reshuffler - ${stateVars.playlistSettings.playlistName}`;
    const currPlayWinTitle = `Now Playing - ${mcc.dataset.title}`;

    if (stateVars.playingNow != null) {
        switch (state) {
            case 1: {
                // Pausing a played video
                embed ? null : player.pauseVideo();

                mci.src = embed ? "/renderer/assets/pause-icon.svg" : "/renderer/assets/play-icon.svg";
                scc.src = "/renderer/assets/pause-icon.svg";

                embed ? window.playlistAPI.changeWindowTitle(currPlayWinTitle) : window.playlistAPI.changeWindowTitle(defWinTitle);

                break;
            }
            case 3:
            case 2: {
                // Playing a paused / stopped video
                embed ? null : player.playVideo();

                mci.src = embed ? "/renderer/assets/play-icon.svg" : "/renderer/assets/pause-icon.svg";
                scc.src = "/renderer/assets/play-icon.svg";

                embed ? window.playlistAPI.changeWindowTitle(defWinTitle) : window.playlistAPI.changeWindowTitle(currPlayWinTitle);

                break;
            }
        }
    }
}

export function changePlayer(musicContainer) {
    // Adjust width for active player state
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
        // Add stateIcon to the current playing song on right side
        const mcc = document.querySelector(`.music-container[data-id="${stateVars.playingNow}"]`);
        mcc.insertAdjacentHTML("beforeend", HTMLs.stateIcon("mini", "pause"));

        stateElements.info.innerHTML = `<span style="font-size: 8pt">${mcc.dataset.pos}.</span> ${mcc.dataset.title}`;

        // Remove the stateIcon on previous song
        if (stateVars.playingBefore != null) {
            const mcb = document.querySelector(`.music-container[data-id="${stateVars.playingBefore}"]`);
            mcb.removeChild(mcb.lastElementChild);
        }

        window.playlistAPI.changeWindowTitle(`Now Playing - ${musicContainer.dataset.title}`);

        // Update presence if user activate from settings, added workaround for deleted video
        if (stateVars.appSettings.useDiscord && musicContainer.dataset.title != "Deleted video") {
            setTimeout(() => {
                window.richPresence.setActivity({
                    title: musicContainer.dataset.title,
                    details: musicContainer.dataset.channel,
                    id: musicContainer.dataset.id,
                    playlistName: stateVars.playlistSettings.playlistName,
                });
            }, 1000);
        }

        player.loadVideoById(musicContainer.dataset.id);
        return player.playVideo();
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
        // Not-so-hacky workaround because I don't want to use `createElement`
        musicContainer = HTMLs.musicContainer(s.title, channelCleaner(s.channel), s.id, pos);
        stateElements.playlistContainer.insertAdjacentHTML("beforeend", musicContainer);
        pos++;
    }

    // Default presence value for loading playlist
    if (stateVars.appSettings.useDiscord) {
        window.richPresence.setActivity({
            title: name,
            details: "Browsing musics",
        });
    }

    // Assign containers function every playlist load
    return assignSongsContainer();
}

export async function resetPlaylist(name) {
    await loadPlaylist(name);

    stateVars.playingBefore = null;
    stateVars.playingNow = null;

    // Resets column width
    changeLayout("reset");

    // Resets search
    resetSearch();

    // Resets info
    stateElements.info.innerHTML = "";

    // Scroll to first music
    jumpTo(1, "smooth");

    return player.pauseVideo();
}

export function playNext() {
    if (stateVars.playingNow != null) {
        // "Play on visible" when the search bar is not empty
        if (stateElements.searchInput.value != "") {
            // Find the current music position based on visible container
            const visibleCont = document.querySelectorAll(".music-container:not(.hidden)");

            // Prevent empty visible container to be selected
            if (visibleCont.length > 0) {
                // Case of only 1 search appear, go back to 0 second
                if (visibleCont.length == 1) {
                    return player.seekTo(0);
                } else {
                    let curr = getCurrentMusicPosition("visible", visibleCont);
                    curr == visibleCont.length - 1 ? (curr = -1) : curr;
                    return changePlayer(visibleCont[curr + 1]);
                }
            }
        } else {
            let curr = getCurrentMusicPosition();
            curr == stateVars.songs.length - 1 ? (curr = -1) : curr;
            return changePlayer(stateVars.songs[curr + 1]);
        }
    }
}

export function playPrevious() {
    if (stateVars.playingNow != null) {
        // Play previous when the current time is under 3 secs, otherwise, resets the music
        if (Math.floor(player.getCurrentTime() <= 3)) {
            if (stateElements.searchInput.value != "") {
                // Find the current music position based on visible container
                const visibleCont = document.querySelectorAll(".music-container:not(.hidden)");

                if (visibleCont.length > 0) {
                    // Case of only 1 search appear, go back to 0 second
                    if (visibleCont.length == 1) {
                        return player.seekTo(0);
                    } else {
                        let curr = getCurrentMusicPosition("visible", visibleCont);
                        curr == 0 ? (curr = visibleCont.length) : curr;
                        return changePlayer(visibleCont[curr - 1]);
                    }
                }
            } else {
                let curr = getCurrentMusicPosition();
                curr == 0 ? (curr = stateVars.songs.length) : curr;
                return changePlayer(stateVars.songs[curr - 1]);
            }
        } else {
            return player.seekTo(0);
        }
    }
}

export function randomizer() {
    const rIndex = Math.floor(Math.random() * stateVars.songs.length);
    return changePlayer(stateVars.songs[rIndex]);
}
