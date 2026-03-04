import { useEffect } from 'react';

import type { Message, MessageData } from '../types';

/**
 * A helper function to create a hook that can listen for messages coming through chrome.runtime.onMessage
 * with e2e type safety
 * @returns a hook that can be used to listen for messages from the background script.
 */
export function createUseMessage<M>() {
    return function useMessage<N extends keyof M, D extends MessageData<M, N>>(
        name: N,
        callback: (data: D) => void
    ): void {
        useEffect(() => {
            const onMessage = (message: Message<M>) => {
                if (message.name === name) {
                    callback(message.data);
                }
                return true;
            };

            chrome.runtime.onMessage.addListener(onMessage);

            return () => {
                chrome.runtime.onMessage.removeListener(onMessage);
            };
        }, [name, callback]);
    };
}
