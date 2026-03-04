/**
 * A content script can be invalidated if a chrome extension is reloaded / updated.
 * This function is used to detect when the extension's context has been invalidated, and to call a callback.
 * @param callback A callback to be called when the extension's context has been invalidated
 */
export function onContextInvalidated(callback: () => void) {
    const interval = setInterval(() => {
        // this means the current tab's context has been invalidated
        if (!chrome.runtime.id) {
            clearInterval(interval);
            callback();
        }
    }, 1 * 1000);
}
