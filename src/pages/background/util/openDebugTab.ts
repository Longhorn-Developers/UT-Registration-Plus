import { DevStore } from '@shared/storage/DevStore';

/**
 * Opens the debug tab as the first tab in the browser if the environment is set to development.
 * @returns {Promise<void>} A promise that resolves once the debug tab is opened.
 */
export async function openDebugTab() {
    if (process.env.NODE_ENV === 'development') {
        const [debugTabId, wasDebugTabVisible] = await Promise.all([
            DevStore.get('debugTabId'),
            DevStore.get('wasDebugTabVisible'),
        ]);

        const isAlreadyOpen = await (await chrome.tabs.query({})).some(tab => tab.id === debugTabId);
        if (isAlreadyOpen) return;

        const tab = await chrome.tabs.create({
            url: chrome.runtime.getURL('debug.html'),
            active: wasDebugTabVisible,
            pinned: true,
            index: 0,
        } satisfies chrome.tabs.CreateProperties);

        await DevStore.set('debugTabId', tab.id);
    }
}
