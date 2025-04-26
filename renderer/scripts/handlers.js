import { stateVars, stateElements } from "./states.js";
import { debounce, search } from "./utils.js";
import { changePlayer, loadPlaylist, resetPlaylist } from "./controllers.js";

export function assignSongsContainer() {
    stateVars.songs = document.querySelectorAll(".music-container");

    for (let s of stateVars.songs) {
        s.addEventListener("click", (e) => {
            changePlayer(e.currentTarget);
        });
    }
}

function assignButtons() {
    // Fetcher
    const fetcher = document.querySelector("#fetchBtn");

    // Prevent multiple clicks when fetching
    async function fetcherHandler() {
        fetcher.removeEventListener("click", fetcherHandler);
        await window.playlistAPI.fetchDataFromYT(stateVars.playlistSettings.playlistID);
        await resetPlaylist(stateVars.playlistSettings.playlistName).then(() => {
            fetcher.addEventListener("click", fetcherHandler);
        });
    }
    fetcher.addEventListener("click", fetcherHandler);

    // Search
    stateElements.searchInput.addEventListener("keyup", (e) => {
        let searchInput = debounce(search, 200);
        searchInput(e.target.value);
    });

    // Clear Search
    stateElements.clearSearch.addEventListener("click", (e) => {
        stateElements.searchInput.value = "";
        search("");
    });

    // Reshuffler
    stateElements.reshuffler.addEventListener("click", async () => {
        let shuffledName = await window.playlistAPI.shufflePlaylist(stateVars.playlistSettings.playlistName);
        await resetPlaylist(shuffledName, stateElements.searchInput);
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
