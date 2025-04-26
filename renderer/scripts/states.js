export let stateVars = {
    playingNow: null,
    playingBefore: null,
    playlistSettings: {},
    songs: [],
};

export let stateElements = {
    playlistContainer: document.querySelector("#playlist"),
    leftColumn: document.querySelector("#leftColumn"),
    rightColumn: document.querySelector("#rightColumn"),
    searchInput: document.querySelector("input#search"),
    clearSearch: document.querySelector("#clearSearch"),
    reshuffler: document.querySelector("#reshuffleBtn"),
}
