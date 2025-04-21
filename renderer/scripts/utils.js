import { stateVars, stateElements } from "./states.js";

export function debounce(f, d) {
    let timer;
    return function (...a) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            f.apply(this, a);
        }, d);
    };
}

export function search(n) {
    if (n != "") {

        stateElements.clearSearch.classList.add("block")
        stateElements.clearSearch.classList.remove("hidden")

        let query = n.toLowerCase();
        if (n.substring(0, 2) == "p:") {
            // Search based on position
            for (let d of stateVars.songs) {
                if (!d.dataset.pos.toLowerCase().includes(query.substring(2))) {
                    d.classList.add("hidden");
                } else {
                    d.classList.remove("hidden");
                }
            }
        } else
        if (n.substring(0, 2) == "a:") {
            // Search based on channel name
            for (let d of stateVars.songs) {
                if (!d.dataset.channel.toLowerCase().includes(query.substring(2))) {
                    d.classList.add("hidden");
                } else {
                    d.classList.remove("hidden");
                }
            }
        } else {
            // Search based on songs name
            for (let d of stateVars.songs) {
                if (!d.dataset.title.toLowerCase().includes(query)) {
                    d.classList.add("hidden");
                } else {
                    d.classList.remove("hidden");
                }
            }
        }
    } else {

        stateElements.clearSearch.classList.add("hidden")
        stateElements.clearSearch.classList.remove("block")

        for (let d of stateVars.songs) {
            d.classList.remove("hidden");
        }
    }
}
