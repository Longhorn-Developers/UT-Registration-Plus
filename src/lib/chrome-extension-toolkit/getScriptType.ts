declare const ServiceWorkerGlobalScope:
    | { new (): EventTarget; prototype: EventTarget }
    | undefined;

/**
 * Possible contexts in which a chrome extension can run.
 */
export enum ScriptType {
    CONTENT_SCRIPT = "content_script",
    BACKGROUND_SCRIPT = "background_script",
    EXTENSION_POPUP = "extension_popup",
    EXTENSION_PAGE = "extension_page",
}

/**
 * Identifies whether code is running in a content script, background script,
 * popup, or another extension page.
 * These contexts have different extension API capabilities.
 * For example, the tabs API is unavailable in content scripts.
 * @returns The current script type, or null if no extension runtime is available.
 */
export default function getScriptType(): ScriptType | null {
    if (!chrome?.runtime?.id) {
        // we are not in a chrome extension
        return null;
    }
    const manifest = chrome.runtime.getManifest();
    if (
        typeof ServiceWorkerGlobalScope !== "undefined" &&
        globalThis instanceof ServiceWorkerGlobalScope
    ) {
        return ScriptType.BACKGROUND_SCRIPT;
    }

    const runtimeBase = chrome.runtime.getURL("");
    if (window.location.href.startsWith(runtimeBase)) {
        if (window.location.href.includes("_generated_background_page.html")) {
            return ScriptType.BACKGROUND_SCRIPT;
        }
        const popupPath =
            manifest.action?.default_popup ||
            manifest.browser_action?.default_popup;
        if (popupPath && window.location.href.includes(popupPath)) {
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
    return isPage && pageName
        ? window.location.href.includes(pageName)
        : isPage;
}
