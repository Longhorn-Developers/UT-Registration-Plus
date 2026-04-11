import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { SerializedCustomTimeBlock } from '@shared/types/CustomTimeBlock';
import { useEffect, useState } from 'react';

/**
 * Live list of custom calendar blocks from {@link UserScheduleStore}.
 */
export default function useCustomTimeBlocks(): SerializedCustomTimeBlock[] {
    const [blocks, setBlocks] = useState<SerializedCustomTimeBlock[]>([]);

    useEffect(() => {
        void UserScheduleStore.get('customTimeBlocks').then(v => setBlocks(v ?? []));

        const unsub = UserScheduleStore.subscribe('customTimeBlocks', ({ newValue }) => {
            setBlocks(newValue ?? []);
        });

        return () => {
            UserScheduleStore.unsubscribe(unsub);
        };
    }, []);

    return blocks;
}

export async function upsertCustomTimeBlock(block: SerializedCustomTimeBlock): Promise<void> {
    const blocks = (await UserScheduleStore.get('customTimeBlocks')) ?? [];
    const idx = blocks.findIndex(b => b.id === block.id);
    if (idx === -1) {
        await UserScheduleStore.set('customTimeBlocks', [...blocks, block]);
    } else {
        const next = blocks.slice();
        next[idx] = block;
        await UserScheduleStore.set('customTimeBlocks', next);
    }
}

export async function removeCustomTimeBlock(id: string): Promise<void> {
    const blocks = (await UserScheduleStore.get('customTimeBlocks')) ?? [];
    await UserScheduleStore.set(
        'customTimeBlocks',
        blocks.filter(b => b.id !== id)
    );
}
