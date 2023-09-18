import HotReloadingMessages from 'src/shared/messages/HotReloadingMessages';
import { MessageHandler } from 'chrome-extension-toolkit';
import { DevStore } from 'src/shared/storage/DevStore';

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
