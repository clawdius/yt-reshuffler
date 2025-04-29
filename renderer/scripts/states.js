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
    fetcher: document.querySelector("#fetchBtn"),
    randomizer: document.querySelector("#randomBtn"),
    previousControl: document.querySelector("#controlPrevious"),
    nextControl: document.querySelector("#controlNext"),
    midContainer: document.querySelector("#mid"),
    botContainer: document.querySelector("#bot"),
    info: document.querySelector("#info")
}
