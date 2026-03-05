/**
 * Global promise to track offscreen document creation.
 * Prevents concurrent creation attempts.
 */
let creatingOffscreen: Promise<void> | null = null;

const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';

/**
 * Ensures an offscreen document exists for DOM parsing operations.
 * Uses Chrome's offscreen API to create a hidden document with full DOM access.
 *
 * This is necessary because service workers don't have access to DOM APIs like DOMParser.
 * The offscreen document persists until explicitly closed or the extension is reloaded.
 *
 * @returns Promise that resolves when the offscreen document is ready
 */
export default async function ensureOffscreenDocument(): Promise<void> {
    // If already creating, wait for that to complete
    if (creatingOffscreen) {
        await creatingOffscreen;
        return;
    }

    // Check if an offscreen document already exists
    const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
        documentUrls: [offscreenUrl],
    });

    // Document already exists, no need to create
    if (existingContexts?.length > 0) {
        return;
    }

    // Create the offscreen document
    creatingOffscreen = chrome.offscreen.createDocument({
        url: OFFSCREEN_DOCUMENT_PATH,
        reasons: [chrome.offscreen.Reason.DOM_PARSER],
        justification: 'Parse course catalog HTML for status checker feature',
    });

    await creatingOffscreen;
    creatingOffscreen = null;
}
