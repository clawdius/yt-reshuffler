function changePlayer(id) {
    player.loadVideoById(id);
    player.playVideo();
}

function assignSongsContainer() {
    let songs = document.querySelectorAll(".music-container")
    for(let s of songs) {
        s.addEventListener("click", () => {
            changePlayer(s.dataset.id)
        })
    }
}

window.onload = () => {
   assignSongsContainer();
}