import HotReloadingMessages from 'src/shared/messages/HotReloadingMessages';
import { MessageHandler } from 'chrome-extension-toolkit';
import { devStore } from 'src/shared/storage/DevStore';

const hotReloadingHandler: MessageHandler<HotReloadingMessages> = {
    async reloadExtension({ sendResponse }) {
        const { isExtensionReloading, isTabReloading } = await devStore.get(['isExtensionReloading', 'isTabReloading']);
        if (!isExtensionReloading) return sendResponse();

        if (isTabReloading) {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const tabToReload = tabs[0];

            await devStore.set('reloadTabId', tabToReload?.id);
        }
        chrome.runtime.reload();
    },
};

export default hotReloadingHandler;
