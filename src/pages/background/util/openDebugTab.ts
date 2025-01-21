import { DevStore } from '@shared/storage/DevStore';

/**
 * Open the debug tab as the first tab
 */
export async function openDebugTab() {
    if (process.env.NODE_ENV === 'development') {
        const [debugTabId, wasDebugTabVisible] = await Promise.all([
            DevStore.get('debugTabId'),
            DevStore.get('wasDebugTabVisible'),
        ]);

        const isAlreadyOpen = (await browser.tabs.query({})).some(tab => tab.id === debugTabId);
        if (isAlreadyOpen) return;

        const tab = await browser.tabs.create({
            url: browser.runtime.getURL('debug.html'),
            active: wasDebugTabVisible,
            pinned: true,
            index: 0,
        });

        await DevStore.set('debugTabId', tab.id);
    }
}
