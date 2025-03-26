function changePlayer(id) {
    player.loadVideoById(id);
    player.playVideo();
}

function assignSongsContainer() {
    let songs = document.querySelectorAll(".music-container");
    for (let s of songs) {
        s.addEventListener("click", () => {
            changePlayer(s.dataset.id);
        });
    }
}

async function loadPlaylist(name) {
    let songs = await window.playlistAPI.loadPlaylist(name);
    let musicContainer;

    const leftColumn = document.querySelector("#leftColumn");

    for (let s of songs) {
        // Not-so-hacky because I don't want to use `createElement`
        musicContainer = `
        <div class="music-container flex flex-col my-2 cursor-pointer" data-id="${s.id}">
            <div class="music-title">${s.title}</div>
            <div class="music-channel">${s.channel}</div>
        </div>
        `;

        leftColumn.insertAdjacentHTML("beforeend", musicContainer)
    }
}

window.onload = async () => {
    await loadPlaylist("analogous");
    assignSongsContainer();
};
