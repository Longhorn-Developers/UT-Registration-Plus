import type { MessageHandler } from '@chrome-extension-toolkit';
import type DataCollectionMessages from '@shared/messages/DataCollectionMessages';
import browser from 'webextension-polyfill';

const dataCollectionHandler: MessageHandler<DataCollectionMessages> = {
    async getDataCollectionPermissions({ sendResponse }) {
        try {
            sendResponse((await browser.permissions.getAll()).data_collection ?? []);
        } catch {
            sendResponse([]);
        }
    },
};

export default dataCollectionHandler;
