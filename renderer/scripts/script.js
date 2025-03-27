import * as HTMLs from "./HTMLs.js";

let playingNow = null,
    playingBefore = null;

function playerController(state, playingNow) {
    const mcc = document.querySelector(`.music-container[data-id="${playingNow}"]`);

    switch (state) {
        case 1: {
            // Pausing a played video
            player.pauseVideo();

            mcc.removeChild(mcc.lastElementChild);
            mcc.insertAdjacentHTML("beforeend", HTMLs.pauseHTML);

            break;
        }
        case 2: {
            // Playing a paused video
            player.playVideo();

            mcc.removeChild(mcc.lastElementChild);
            mcc.insertAdjacentHTML("beforeend", HTMLs.playHTML);

            break;
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

async function loadPlaylist(name) {
    let songs = await window.playlistAPI.loadPlaylist(name);
    let musicContainer;

    const playlistContainer = document.querySelector("#playlist");

    for (let s of songs) {
        // Not-so-hacky because I don't want to use `createElement`
        musicContainer = `
        <div class="music-container flex my-2 py-2 cursor-pointer justify-between" data-id="${s.id}">
            <div class="flex flex-col">
                <div class="music-title">${s.title}</div>
                <div class="music-channel">${s.channel}</div>
            </div>
        </div>
        `;

        playlistContainer.insertAdjacentHTML("beforeend", musicContainer);
    }
}

window.onload = async () => {
    await loadPlaylist("analogous");
    assignSongsContainer();
};
