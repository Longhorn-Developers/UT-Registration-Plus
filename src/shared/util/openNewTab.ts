import type { TabOptions, TabResponse } from 'browser-extension-toolkit';
import { MESSAGE_TYPES, MessagingProxy } from 'browser-extension-toolkit';

const proxy = new MessagingProxy('content');

/**
 * Open a new tab via the background proxy messaging system.
 *
 * @param options - The options for the new tab.
 * @returns A promise that resolves when the tab has been opened.
 */
export async function openNewTab(options: TabOptions): Promise<TabResponse> {
    const response = await proxy.sendProxyMessage<typeof MESSAGE_TYPES.TAB.OPEN, TabResponse>(
        MESSAGE_TYPES.TAB.OPEN,
        options
    );

    if (!response.success) {
        throw new Error(`Failed to open tab: ${response.error}`);
    }

    if (!response.data) {
        throw new Error('Tab ID was not returned');
    }

    return response.data;
}
