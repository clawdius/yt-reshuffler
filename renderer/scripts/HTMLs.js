export const stateIcon = (type, state) => {
            return `
                <div ${type == "main" ? "id=controlState" : ""} class="flex align-items-center ${type == "mini" ? "mr-5" : "h-full justify-center"}">
                    <img src="/renderer/assets/${state}-icon.svg" ${type == "main" ? "class='h-full'" : ""}>
                </div>
            `;
        };

export const musicContainer = (title, channel, id, pos) => {
    return `
    <div class="music-container flex my-2 py-2 cursor-pointer justify-between w-full" data-id="${id}" data-title='${title}' data-pos="${pos}" data-channel="${channel}">
            <div class="flex flex-col">
                <div class="music-position ml-3">${pos}</div>
                <div class="music-title ml-3">${title}</div>
                <div class="music-channel ml-3">${channel}</div>
            </div>
        </div>
    `;
};
