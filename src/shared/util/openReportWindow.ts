/**
 * Open the report window relative centered to the current window.
 */
export function openReportWindow() {
    chrome.windows.getCurrent({ populate: false }, currentWindow => {
        const width = 400;
        const height = 600;

        // Calculate the new window's position to center it relative to the current window
        const left =
            currentWindow.left && currentWindow.width
                ? Math.round(currentWindow.left + (currentWindow.width - width) / 2)
                : undefined;
        const top =
            currentWindow.top && currentWindow.height
                ? Math.round(currentWindow.top + (currentWindow.height - height) / 2)
                : undefined;

        chrome.windows.create({
            url: chrome.runtime.getURL(`report.html`),
            type: 'popup',
            width,
            height,
            left,
            top,
        });
    });
}
