import { DevStore } from '@shared/storage/DevStore';

import { CRX_PAGES } from '../types/CRXPages';
import { openNewTab } from './openNewTab';

/**
 * Open the debug tab as the first tab
 */
export async function openDebugTab(): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
        const [debugTabId, wasDebugTabVisible] = await Promise.all([
            DevStore.get('debugTabId'),
            DevStore.get('wasDebugTabVisible'),
        ]);

        const isAlreadyOpen = (await browser.tabs.query({})).some(tab => tab.id === debugTabId);
        if (isAlreadyOpen) return;

        const tab = await openNewTab({
            url: browser.runtime.getURL(CRX_PAGES.DEBUG),
            active: wasDebugTabVisible,
            pinned: true,
            index: 0,
        });

        await DevStore.set('debugTabId', tab.tabId);
    }
}
