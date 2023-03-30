import { devStore } from 'src/shared/storage/DevStore';

/**
 * Open the debug tab as the first tab
 */
export async function openDebugTab() {
    if (process.env.NODE_ENV === 'development') {
        const { debugTabId, wasDebugTabVisible } = await devStore.get(['debugTabId', 'wasDebugTabVisible']);

        const isAlreadyOpen = await (await chrome.tabs.query({})).some(tab => tab.id === debugTabId);
        if (isAlreadyOpen) return;

        const tab = await chrome.tabs.create({
            url: chrome.runtime.getURL('debug.html'),
            active: wasDebugTabVisible,
            pinned: true,
            index: 0,
        });

        await devStore.set('debugTabId', tab.id);
    }
}
