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
        let name = n.toLowerCase();
        for (let d of stateVars.songs) {
            if (!d.dataset.title.toLowerCase().includes(name)) {
                d.classList.add("hidden");
            } else {
                d.classList.remove("hidden");
            }
        }
    } else {
        for (let d of stateVars.songs) {
            d.classList.remove("hidden");
        }
    }
}
