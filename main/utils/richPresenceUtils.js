function rpcSetActivity(handlersData, frontPayload) {
    const { title, details, playlistName = null, id = null, buttons = null } = frontPayload;

    let rpcPayload = {
        type: 2,
        details: title,
        state: details,
        smallImageKey: "github-icon",
        smallImageText: "YT-Reshuffler on Github",
        startTimestamp: new Date(),
    };

    // If `id` exist, mostly come from playing music
    if(id) {
        delete rpcPayload.smallImageKey
        delete rpcPayload.smallImageText,
        rpcPayload.largeImageText = playlistName,
        rpcPayload.largeImageKey = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    }

    if(buttons) {
        rpcPayload.buttons = buttons;
    }

    handlersData.rpc.user.setActivity(
        rpcPayload,
    );
}

module.exports = {
    rpcSetActivity,
};
