const startTime = new Date();

function rpcSetActivity(handlersData, rpcPayload) {
    const { title, details, playlistName = "", id = "" } = rpcPayload;
    handlersData.rpc.user.setActivity({
        type: 2,
        details: title,
        state: details,
        startTimestamp: startTime,
        smallImageKey: id != "" ? "" : "github-icon",
        smallImageText: "YT-Reshuffler on Github",
        largeImageText: playlistName != "" ? playlistName : "",
        largeImageKey: id != "" ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : ""
    });
}

module.exports = {
    rpcSetActivity,
}