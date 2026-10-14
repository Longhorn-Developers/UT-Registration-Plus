import { type CourseMeeting, DAY_MAP } from '@shared/types/CourseMeeting';
import type { CustomBlock, CustomBlockDraft } from '@shared/types/CustomBlock';

const validTime = (time: number) => Number.isInteger(time) && time >= 0 && time < 1440;

export function customBlockFromDraft(draft: CustomBlockDraft, scheduleId: string, id: string): CustomBlock {
    const { syncAcrossAllSchedules, ...values } = draft;
    if (
        !values.name.trim() ||
        values.days.length === 0 ||
        values.days.some(day => !Object.values(DAY_MAP).includes(day)) ||
        !validTime(values.startTime) ||
        !validTime(values.endTime) ||
        (!values.allDay && values.startTime >= values.endTime)
    ) {
        throw new Error('Invalid custom block');
    }
    return {
        ...values,
        name: values.name.trim(),
        days: Object.values(DAY_MAP).filter(day => values.days.includes(day)),
        id,
        scheduleId: syncAcrossAllSchedules ? null : scheduleId,
    };
}

export function customBlockToDraft(block: CustomBlock): CustomBlockDraft {
    const { id: _id, scheduleId, ...values } = block;
    return { ...values, syncAcrossAllSchedules: scheduleId === null };
}

export function selectCustomBlocks(blocks: CustomBlock[], scheduleId: string): CustomBlock[] {
    return blocks.filter(block => block.scheduleId === null || block.scheduleId === scheduleId);
}

export function hasCustomBlockConflict(
    meetings: Pick<CourseMeeting, 'days' | 'startTime' | 'endTime'>[],
    blocks: CustomBlock[]
): boolean {
    return blocks.some(
        block =>
            block.conflictHighlight &&
            meetings.some(
                meeting =>
                    block.days.some(day => meeting.days.includes(day)) &&
                    (block.allDay || (block.startTime < meeting.endTime && block.endTime > meeting.startTime))
            )
    );
}
