import type { Message, MessageData, MessageResponse } from '../types';
import { MessageEndpoint } from '../types';
/**
 * An object that can be used to send messages to the background script.
 */ export type BackgroundMessenger<M> = {
    [K in keyof M]: MessageData<M, K> extends undefined
        ? () => Promise<MessageResponse<M, K>>
        : (data: MessageData<M, K>) => Promise<MessageResponse<M, K>>;
};

/**
 * Where the foreground message is being sent to specifically (which tab or frame)
 */
type ForegroundMessageOptions =
    | {
          tabId: number;
          frameId?: number;
      }
    | {
          tabId: 'ALL' | 'ACTIVE_TAB';
      };

/**
 * an object that can be used to send messages to the foreground (tabs OR extension pages (popup, options, etc.))
 */
export type ForegroundMessenger<M> = {
    [K in keyof M]: MessageData<M, K> extends undefined
        ? (options: ForegroundMessageOptions) => Promise<MessageResponse<M, K>>
        : (data: MessageData<M, K>, options: ForegroundMessageOptions) => Promise<MessageResponse<M, K>>;
};

/**
 * A wrapper for chrome extension messaging with a type-safe API.
 * @type To which context the messages are sent.
 * @returns A proxy object that can be used to send messages to the foreground (tabs or extension pages (popup, options, etc.))
 */
export function createMessenger<M>(destination: 'foreground'): ForegroundMessenger<M>;
/**
 *  A wrapper for chrome extension messaging with a type-safe API.
 * @param type To which context the messages are sent.
 * @returns A proxy object that can be used to send messages to the background script.
 */
export function createMessenger<M>(destination: 'background'): BackgroundMessenger<M>;
/**
 *  A wrapper for chrome extension messaging with a type-safe API.
 * @param destination To which context the messages are sent.
 * @returns A proxy object that can be used to send messages to the background script.
 */
export function createMessenger<M>(destination: 'background' | 'foreground') {
    let to: MessageEndpoint = MessageEndpoint.BACKGROUND;
    let from: MessageEndpoint = MessageEndpoint.FOREGROUND;

    if (destination === 'foreground') {
        to = MessageEndpoint.FOREGROUND;
        from = MessageEndpoint.BACKGROUND;
    }

    const sender = new Proxy({} as any, {
        get(target, prop) {
            const name = prop as keyof M;
            return async (data: MessageData<M, any>, options?: ForegroundMessageOptions) => {
                const message: Message<M> = {
                    name,
                    data,
                    from,
                    to,
                };

                if (to === MessageEndpoint.FOREGROUND && options) {
                    // for messages sent to the tabs, we want to send to the tabs using chrome.tabs.sendMessage,
                    const { tabId } = options;
                    if (typeof tabId === 'number') {
                        return chrome.tabs.sendMessage(tabId, message, { frameId: options.frameId });
                    }
                    if (tabId === 'ACTIVE_TAB') {
                        const tab = (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
                        if (tab && tab.id) {
                            return chrome.tabs.sendMessage(tab.id, message);
                        }
                    }
                    if (tabId === 'ALL') {
                        const tabs = (await chrome.tabs.query({})).filter(tab => tab.id !== undefined && tab.url);
                        return Promise.any([
                            ...tabs.map(tab => chrome.tabs.sendMessage(tab.id!, message)),
                            chrome.runtime.sendMessage(message),
                        ]);
                    }
                }
                return chrome.runtime.sendMessage(message);
            };
        },
    });
    return sender;
}
