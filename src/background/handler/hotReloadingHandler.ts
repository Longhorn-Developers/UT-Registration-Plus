import HotReloadingMessages from 'src/shared/messages/HotReloadingMessages';
import { MessageHandler } from 'chrome-extension-toolkit';
import { devStore } from 'src/shared/storage/devStore';

const hotReloadingHandler: MessageHandler<HotReloadingMessages> = {
    async reloadExtension({ sendResponse }) {
        const isExtensionReloading = await devStore.getIsExtensionReloading();
        if (!isExtensionReloading) return sendResponse();

        const isTabReloading = await devStore.getIsExtensionReloading();
        if (isTabReloading) {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const tabToReload = tabs[0];

            await devStore.setReloadTabId(tabToReload?.id);
        }
        chrome.runtime.reload();
    },
};

export default hotReloadingHandler;
