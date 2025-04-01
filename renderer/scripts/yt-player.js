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
            fs: 0,
        },
        events: {
            "onStateChange": (e) => {
                if (e.data == 1 || e.data == 2) {
                    window.playerController(e.data, window.playerController.playingNow, true);
                }

                if (e.data == 0) {
                    window.playerController.playNext();
                }
            },
            "onError": (e) => {
                setTimeout(window.playerController.playNext, 1000);
            },
        },
    });
}
