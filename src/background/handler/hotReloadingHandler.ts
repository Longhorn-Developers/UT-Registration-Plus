import HotReloadingMessages from 'src/shared/messages/HotReloadingMessages';
import { MessageHandler } from 'chrome-extension-toolkit';
import { DevStore } from 'src/background/storage/DevStore';

const hotReloadingHandler: MessageHandler<HotReloadingMessages> = {
    async reloadExtension({ sendResponse }) {
        const isExtensionReloading = await DevStore.getIsExtensionReloading();
        if (!isExtensionReloading) return sendResponse();

        const isTabReloading = await DevStore.getIsExtensionReloading();
        if (isTabReloading) {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const tabToReload = tabs[0];

            await DevStore.setReloadTabId(tabToReload?.id);
        }
        chrome.runtime.reload();
    },
};

export default hotReloadingHandler;
