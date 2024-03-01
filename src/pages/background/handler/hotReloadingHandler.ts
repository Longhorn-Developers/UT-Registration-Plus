import type HotReloadingMessages from '@shared/messages/HotReloadingMessages';
import { DevStore } from '@shared/storage/DevStore';
import type { MessageHandler } from 'chrome-extension-toolkit';

const hotReloadingHandler: MessageHandler<HotReloadingMessages> = {
    async reloadExtension({ sendResponse }) {
        const [isExtensionReloading, isTabReloading] = await Promise.all([
            DevStore.get('isExtensionReloading'),
            DevStore.get('isTabReloading'),
        ]);

        if (!isExtensionReloading) return sendResponse();

        if (isTabReloading) {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const tabToReload = tabs[0];

            await DevStore.set('reloadTabId', tabToReload?.id);
        }
        chrome.runtime.reload();
    },
};

export default hotReloadingHandler;
