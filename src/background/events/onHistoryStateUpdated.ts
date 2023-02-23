/**
 * This event is fired when any tab's url changes.
 * This is useful for content scripts to know when SPA navigations occur.
 * @param details
 */
export default function onHistoryStateUpdated(
    details: chrome.webNavigation.WebNavigationTransitionCallbackDetails
): void {
    const { tabId, url } = details;
    // TODO: send a message to tab with tabId to reanalyze the page
}
