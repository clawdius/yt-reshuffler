export const playHTML = `
    <div class="flex align-items-center mr-5">
        <img src="/renderer/assets/play-icon.svg">
    </div>
`;

export const pauseHTML = `
    <div class="flex align-items-center mr-5">
        <img src="/renderer/assets/pause-icon.svg">
    </div>
`;

export const musicContainer = (title, channel, id, pos) => {
    return `
    <div class="music-container flex my-2 py-2 cursor-pointer justify-between w-full" data-id="${id}" data-title="${title}" data-pos="${pos}">
            <div class="flex flex-col">
                <div class="music-position ml-3">${pos}</div>
                <div class="music-title ml-3">${title}</div>
                <div class="music-channel ml-3">${channel}</div>
            </div>
        </div>
    `
}