import type { ExtensionMessages } from '@shared/messages/ExtensionMessages';
import type { MessageHandler } from 'chrome-extension-toolkit';

const extensionHandler: MessageHandler<ExtensionMessages> = {
    makeProxyRequest({ data, sendResponse }) {
        fetch(data.url, {
            method: data.method,
            body: data.body,
        })
            .then(response => (data.response === 'json' ? response.json() : response.text()))
            .then(sendResponse);
    },
};

export default extensionHandler;
