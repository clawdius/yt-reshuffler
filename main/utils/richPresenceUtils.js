function rpcSetActivity(handlersData, frontPayload) {
    const { title, details, playlistName = null, id = null } = frontPayload;

    let rpcPayload = {
        type: 2,
        details: title,
        state: details,
        smallImageKey: "github-icon",
        smallImageText: "YT-Reshuffler on Github",
        startTimestamp: new Date(),
        buttons: [
            {
                label: "App Repository",
                url: "https://github.com/clawdius/yt-reshuffler",
            },
        ],
    };

    // If `id` exist, mostly come from playing music
    if (id) {
        delete rpcPayload.smallImageKey;
        delete rpcPayload.smallImageText;
        rpcPayload.largeImageText = playlistName;
        rpcPayload.largeImageKey = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
        rpcPayload.buttons = [
            {
                label: "Listen on Youtube Music",
                url: `https://music.youtube.com/watch?v=${id}`,
            },
        ];
    }

    handlersData.rpc.user.setActivity(rpcPayload);
}

module.exports = {
    rpcSetActivity,
};
