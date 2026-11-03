import { CustomBlockStore } from '@shared/storage/CustomBlockStore';
import { selectCustomBlocks } from '@shared/util/customBlocks';
import { useMemo } from 'react';

export default function useCustomBlocks(scheduleId?: string) {
    const [blocks] = CustomBlockStore.use('blocks');
    return useMemo(() => (scheduleId ? selectCustomBlocks(blocks, scheduleId) : []), [blocks, scheduleId]);
}
