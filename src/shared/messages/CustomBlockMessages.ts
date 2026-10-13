import type { CustomBlock, CustomBlockDraft } from '@shared/types/CustomBlock';

export type CustomBlockResult<T> = { data: T } | { error: string };

export interface CustomBlockMessages {
    createCustomBlock: (data: { draft: CustomBlockDraft; scheduleId: string }) => CustomBlockResult<CustomBlock>;
    updateCustomBlock: (data: {
        id: string;
        draft: CustomBlockDraft;
        scheduleId: string;
    }) => CustomBlockResult<CustomBlock>;
    deleteCustomBlock: (data: { id: string }) => CustomBlockResult<void>;
}
