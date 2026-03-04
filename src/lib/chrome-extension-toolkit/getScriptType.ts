/**
 * Possible contexts in which a chrome extension can run.
 */
export enum ScriptType {
    CONTENT_SCRIPT = 'content_script',
    BACKGROUND_SCRIPT = 'background_script',
    EXTENSION_POPUP = 'extension_popup',
    EXTENSION_PAGE = 'extension_page',
}

/**
 * Chrome extension code can run in different contexts.
 * These different contexts have different capabilities and access to certain parts of the chrome extensions API.
 * For example, the chrome.tabs api is not readily available in the content scripts.
 * This function is used to identify the context in which the code is running.
 * @returns The context in which the code is running, or null if the code is not running in a chrome extension.
 */
export default function getScriptType(): ScriptType | null {
    if (!chrome?.runtime?.id) {
        // we are not in a chrome extension
        return null;
    }
    const manifest = chrome.runtime.getManifest();
    if (globalThis.window === undefined) {
        return ScriptType.BACKGROUND_SCRIPT;
    }

    if (window.location.href.startsWith(`chrome-extension://${chrome.runtime.id}`)) {
        if (manifest.action?.default_popup && window.location.href.includes(manifest.action.default_popup)) {
            return ScriptType.EXTENSION_POPUP;
        }
        return ScriptType.EXTENSION_PAGE;
    }

    return ScriptType.CONTENT_SCRIPT;
}

/**
 * A helper function to check if the code is running in a content script.
 * @returns true if the code is running in a content script, false otherwise.
 */
export function isContentScript(): boolean {
    return getScriptType() === ScriptType.CONTENT_SCRIPT;
}

/**
 * A helper function to check if the code is running in the background script.
 * @returns true if the code is running in the background script, false otherwise.
 */
export function isBackgroundScript(): boolean {
    return getScriptType() === ScriptType.BACKGROUND_SCRIPT;
}

/**
 * A helper function to check if the code is running in the extension popup.
 * @returns true if the code is running in the extension popup, false otherwise.
 */
export function isExtensionPopup(): boolean {
    return getScriptType() === ScriptType.EXTENSION_POPUP;
}

/**
 * A helper function to check if the code is running in an extension page (popup, options, etc.).
 * @returns true if the code is running in an extension page (popup, options, etc.), false otherwise.
 * @param pageName The name of the page to check for. ex: 'options.html'
 */
export function isExtensionPage(pageName?: string): boolean {
    const isPage = getScriptType() === ScriptType.EXTENSION_PAGE;
    return isPage && pageName ? window.location.href.includes(pageName) : isPage;
}
