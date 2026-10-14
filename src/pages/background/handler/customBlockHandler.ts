import type { MessageHandler } from '@chrome-extension-toolkit';
import { createCustomBlock, deleteCustomBlock, updateCustomBlock } from '@pages/background/lib/customBlocks';
import type { CustomBlockMessages, CustomBlockResult } from '@shared/messages/CustomBlockMessages';

async function respond<T>(operation: Promise<T>, sendResponse: (result: CustomBlockResult<T>) => void) {
    try {
        sendResponse({ data: await operation });
    } catch (error) {
        sendResponse({ error: error instanceof Error ? error.message : 'Unable to save custom block' });
    }
}

const customBlockHandler: MessageHandler<CustomBlockMessages> = {
    async createCustomBlock({ data, sendResponse }) {
        await respond(createCustomBlock(data.draft, data.scheduleId), sendResponse);
    },
    async updateCustomBlock({ data, sendResponse }) {
        await respond(updateCustomBlock(data.id, data.draft, data.scheduleId), sendResponse);
    },
    async deleteCustomBlock({ data, sendResponse }) {
        await respond(deleteCustomBlock(data.id), sendResponse);
    },
};

export default customBlockHandler;
