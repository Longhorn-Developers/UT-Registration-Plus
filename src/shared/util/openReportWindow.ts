/**
 * Open the report window relative centered to the current window.
 */
export function openReportWindow() {
    browser.windows.getCurrent({ populate: false }).then(currentWindow => {
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

        browser.windows.create({
            url: browser.runtime.getURL(`report.html`),
            type: 'popup',
            width,
            height,
            left,
            top,
        });
    });
}
