function rpcSetActivity(handlersData, rpcPayload) {
    const { title, details, playlistName = "" } = rpcPayload;
    handlersData.rpc.user.setActivity({
        type: 2,
        details: title,
        state: details,
        smallImageKey: "github-icon",
        smallImageText: "YT-Reshuffler on Github",
        largeImageText: playlistName != "" ? playlistName : ""
    });
}

module.exports = {
    rpcSetActivity,
}