import { stateVars, stateElements } from "./states.js";
import { debounce, jumpTo, search, resetSearch, loader, getCurrentMusicPosition } from "./utils.js";
import { changePlayer, resetPlaylist, playNext, playPrevious, playerController, randomizer } from "./controllers.js";

export function assignSongsContainer() {
    stateVars.songs = document.querySelectorAll(".music-container");

    for (let s of stateVars.songs) {
        s.addEventListener("click", (e) => {
            changePlayer(e.currentTarget);
        });
    }
}

function assignButtons() {
    // -- Fetcher
    // Special case: Prevent multiple fetch simultaneously
    async function fetcherHandler() {
        stateElements.fetcher.removeEventListener("click", fetcherHandler);

         // Weird pause placement, but ok
         player.pauseVideo()

         // "Fetching musics" rich presence
         if (stateVars.appSettings.useDiscord) {
             window.richPresence.setActivity({
                 title: stateVars.playlistSettings.playlistName,
                 details: "Fetching musics from YouTube",
             });
         }

        loader("on", "Fetching data from YouTube...");
        await window.playlistAPI.fetchDataFromYT(stateVars.playlistSettings.playlistID);
        await resetPlaylist(stateVars.playlistSettings.playlistName).then(() => {
            stateElements.fetcher.addEventListener("click", fetcherHandler);
            loader("off");
        });
    }
    stateElements.fetcher.addEventListener("click", fetcherHandler);

    // -- Search
    stateElements.searchInput.addEventListener("keyup", (e) => {
        const searchInput = debounce(search, 200);
        searchInput(e.target.value);
    });

    // -- Clear Search
    stateElements.clearSearch.addEventListener("click", (e) => {
        resetSearch();
        if (stateVars.playingNow != null) {
            jumpTo(getCurrentMusicPosition() + 1, "instant");
        }
    });

    // -- Reshuffler
    stateElements.reshuffler.addEventListener("click", async () => {
        loader("on", "Reshufling playlist...");
        const shuffledName = await window.playlistAPI.shufflePlaylist(stateVars.playlistSettings.playlistName);
        await resetPlaylist(shuffledName, stateElements.searchInput).then(() => {
            loader("off");
        });
    });

    // -- Randomizer
    stateElements.randomizer.addEventListener("click", () => {
        randomizer();
        resetSearch();
        jumpTo(getCurrentMusicPosition() + 1, "instant");
    });

    // -- Main Controls
    // Previous button
    stateElements.previousControl.addEventListener("click", () => {
        playPrevious();
        jumpTo(getCurrentMusicPosition() + 1);
    });

    // Next button
    stateElements.nextControl.addEventListener("click", () => {
        playNext();
        jumpTo(getCurrentMusicPosition() + 1);
    });

    // State Control button
    stateElements.stateControl.addEventListener("click", () => {
        playerController(player.getPlayerState(), stateVars.playingNow, false);
    });

    // Info
    stateElements.info.addEventListener("click", () => {
        jumpTo(getCurrentMusicPosition() + 1);
    });
}

function assignCustomShortcuts() {
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key == "f") {
            document.querySelector("input#search").focus();
        }

        if (e.key == " " && document.activeElement != document.querySelector("input#search")) {
            e.preventDefault();
            if (stateVars.playingNow != null) {
                playerController(player.getPlayerState(), stateVars.playingNow);
            }
        }
    });
}

export function assignHandlers() {
    assignButtons();
    assignCustomShortcuts();
}
