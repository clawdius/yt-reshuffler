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
        stateElements.clearSearch.classList.add("block");
        stateElements.clearSearch.classList.remove("hidden");

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
        } else if (n.substring(0, 2) == "a:") {
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
        stateElements.clearSearch.classList.add("hidden");
        stateElements.clearSearch.classList.remove("block");

        for (let d of stateVars.songs) {
            d.classList.remove("hidden");
        }
    }
}

export function changeLayout(state) {
    switch (state) {
        case "reset":
            if (stateElements.leftColumn.classList.contains("w-2/5") && stateElements.rightColumn.classList.contains("w-3/5")) {
                stateElements.leftColumn.classList.remove("w-2/5", "pl-5");
                stateElements.leftColumn.classList.add("w-0");

                stateElements.rightColumn.classList.remove("w-3/5", "pl-3", "pr-5");
                stateElements.rightColumn.classList.add("w-full", "px-5");

                stateElements.midContainer.classList.remove("h-8/10");
                stateElements.midContainer.classList.add("h-10/10");

                stateElements.botContainer.classList.remove("h-2/10");
                stateElements.botContainer.classList.add("h-0/10");
            }
            break;
        case "active":
            if (stateElements.leftColumn.classList.contains("w-0") && stateElements.rightColumn.classList.contains("w-full")) {
                stateElements.leftColumn.classList.add("w-2/5", "pl-5");
                stateElements.leftColumn.classList.remove("w-0");

                stateElements.rightColumn.classList.add("w-3/5", "pl-3", "pr-5");
                stateElements.rightColumn.classList.remove("w-full", "px-5");

                stateElements.midContainer.classList.add("h-8/10");
                stateElements.midContainer.classList.remove("h-10/10");

                stateElements.botContainer.classList.add("h-2/10");
                stateElements.botContainer.classList.remove("h-0/10");
            }
    }
}
