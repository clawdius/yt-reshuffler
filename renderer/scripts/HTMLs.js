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

export const musicContainer = (title, channel, id) => {
    return `
    <div class="music-container flex my-2 py-2 cursor-pointer justify-between w-19/20 ml-3" data-id="${id}" data-title="${title}">
            <div class="flex flex-col">
                <div class="music-title">${title}</div>
                <div class="music-channel">${channel}</div>
            </div>
        </div>
    `
}