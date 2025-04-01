import { stateVars } from "./states.js";

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
        let query = n.toLowerCase();
        if (n.charAt(0) == ":") {
            // Search based on position
            for (let d of stateVars.songs) {
                if (!d.dataset.pos.toLowerCase().includes(query.substring(1))) {
                    d.classList.add("hidden");
                } else {
                    d.classList.remove("hidden");
                }
            }
        } else {
            // Search based on name
            for (let d of stateVars.songs) {
                if (!d.dataset.title.toLowerCase().includes(query)) {
                    d.classList.add("hidden");
                } else {
                    d.classList.remove("hidden");
                }
            }
        }
    } else {
        for (let d of stateVars.songs) {
            d.classList.remove("hidden");
        }
    }
}
