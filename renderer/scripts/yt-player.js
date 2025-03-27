let tag = document.createElement("script");
tag.src = "https://www.youtube.com/player_api";
let firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let state;
function onYouTubePlayerAPIReady() {
    player = new YT.Player("mainPlayer", {
        events: {
            "onStateChange": (e) => {
                state = e.data;
            },
        },
    });
}
