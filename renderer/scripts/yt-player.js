let tag = document.createElement("script");
tag.src = "https://www.youtube.com/player_api";
let firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let playerState;
function onYouTubePlayerAPIReady() {
    player = new YT.Player("mainPlayer", {
        playerVars: {
            rel: 0,
            disablekb: 1,
        },
        events: {
            "onStateChange": (e) => {
                e.data != 3 ? window.playerController(e.data, window.playerController.playingNow, true) : null;
            },
        },
    });
}
