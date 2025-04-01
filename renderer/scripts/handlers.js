import { stateVars, stateElements } from "./states.js";
import { debounce, search } from "./utils.js";
import { changePlayer } from "./controllers.js";

export function assignSongsContainer() {
    stateVars.songs = document.querySelectorAll(".music-container");

    for (let s of stateVars.songs) {
        s.addEventListener("click", (e) => {
            changePlayer(s.dataset.id, e.currentTarget);
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
        await loadPlaylist(stateVars.playlistSettings.playlistName).then(() => {
            fetcher.addEventListener("click", fetcherHandler);
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