import { stateVars, stateElements } from "./states.js";
import * as HTMLs from "./HTMLs.js";
import { assignHandlers } from "./main-handlers.js";
import { loadPlaylist, playerController, playNext } from "./main-controllers.js";
import { loader } from "./utils.js";

async function startUp() {
    // Set first loaded playlist
    const last = await window.playlistSettings.getLastPlaylist();

    stateVars.playlistSettings = {
        playlistName: last.lastPlaylistName,
        playlistID: last.lastPlaylistID,
    };

    const title = document.querySelector("#playlistTitle");
    title.innerHTML = stateVars.playlistSettings.playlistName;

    // Register the function and variables to global window for youtube embed which is not a module
    window.playerController = playerController;
    window.playerController.playNext = playNext;
    Object.defineProperty(window.playerController, "playingNow", {
        get: () => stateVars.playingNow,
    });

    // Probably temporary solution, add `controlState` at first load and insert into global `stateElements`
    const scc = document.querySelector("#controlStateContainer");
    scc.insertAdjacentHTML("beforeend", HTMLs.stateIcon("main", "play"));
    stateElements.stateControl = document.querySelector("#controlState");

    window.playlistAPI.changeWindowTitle(`YT-Reshuffler - ${stateVars.playlistSettings.playlistName}`);
}

// Sets custom background before everything else
document.addEventListener("DOMContentLoaded", async () => {

    // Assign settings from back
    stateVars.appSettings = await window.playlistSettings.getSettingsValue();

    // Change page's background color
    document.querySelector("body").style.background = stateVars.appSettings.backgroundColor;

    // Temporary loading things
    loader("on", "Loading playlist...")
});

window.onload = async () => {
    await startUp();
    await loadPlaylist(stateVars.playlistSettings.playlistName)
        .catch(async () => {
            // Trying to fetch playlist based on `last-playlist.json` data if the playlist's json doesn't exist.
            // Ideally, this function should check `last-playlist.json` and other important json like `appSettings.json` BEFORE the app launch,
            // will do this in the future.
            await window.playlistAPI.fetchDataFromYT(stateVars.playlistSettings.playlistID);
            await loadPlaylist(stateVars.playlistSettings.playlistName);
        }).finally(() => {
            // Turn off loader
            loader("off");
        })

    // Assign handlers, duh!
    assignHandlers();
};
