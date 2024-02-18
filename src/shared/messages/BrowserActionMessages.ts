/**
 * Represents the interface for browser action messages.
 */
export default interface BrowserActionMessages {
    /**
     * Makes it so that clicking the browser action will open the popup.html.
     */
    enableBrowserAction: () => void;

    /**
     * Makes it so that clicking the browser action will respond to interactions from the content script.
     */
    disableBrowserAction: () => void;
}
