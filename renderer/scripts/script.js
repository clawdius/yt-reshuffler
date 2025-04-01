import { stateVars } from "./states.js";
import { assignHandlers } from "./handlers.js";
import { loadPlaylist, playerController, playNext } from "./controllers.js";

// Utils

async function startUp() {
    // Set first loaded playlist
    const last = await window.playlistSettings.getLastPlaylist();

    stateVars.playlistSettings = {
        playlistName: last.lastPlaylistName,
        playlistID: last.lastPlaylistID,
    };

    const title = document.querySelector("#playlistTitle");
    title.innerHTML = stateVars.playlistSettings.playlistName;

    // Register the function and variables to global window
    window.playerController = playerController;
    window.playerController.playNext = playNext;
    Object.defineProperty(window.playerController, "playingNow", {
        get: () => stateVars.playingNow,
    });

    window.playlistAPI.changeWindowTitle(`YT-Reshuffler - ${stateVars.playlistSettings.playlistName}`);
}

window.onload = async () => {
    await startUp();
    await loadPlaylist(stateVars.playlistSettings.playlistName);

    assignHandlers();
};
