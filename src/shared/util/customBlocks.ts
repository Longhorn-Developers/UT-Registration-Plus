import { isHexColor } from '@shared/types/Color';
import { type CourseMeeting, DAY_MAP } from '@shared/types/CourseMeeting';
import type { CustomBlock, CustomBlockDraft } from '@shared/types/CustomBlock';

// Only bounded to the day: the visible grid hours the form enforces depend on the schedule's courses
const validTime = (time: number) => Number.isInteger(time) && time >= 0 && time <= 1425 && time % 15 === 0;

export function customBlockFromDraft(draft: CustomBlockDraft, scheduleId: string, id: string): CustomBlock {
    const { syncAcrossAllSchedules, ...values } = draft;
    if (
        !values.name.trim() ||
        values.days.length === 0 ||
        // Blocks are weekdays only, matching the form and the Mon–Fri calendar
        values.days.some(day => !Object.values(DAY_MAP).includes(day) || day === DAY_MAP.S || day === DAY_MAP.SU) ||
        !validTime(values.startTime) ||
        !validTime(values.endTime) ||
        (values.color !== undefined && !isHexColor(values.color)) ||
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
    const { name, days, startTime, endTime, allDay, conflictHighlight, color, scheduleId } = block;
    return {
        name,
        days,
        startTime,
        endTime,
        allDay,
        conflictHighlight,
        ...(color === undefined ? {} : { color }),
        syncAcrossAllSchedules: scheduleId === null,
    };
}

/**
 * Checks a stored block, so a corrupt or hand-edited entry is skipped instead of breaking the calendar
 *
 * @param block - The stored value
 * @returns True if it is a block the form could have saved
 */
export function isValidCustomBlock(block: unknown): block is CustomBlock {
    if (typeof block !== 'object' || block === null) return false;
    const { id, scheduleId } = block as Partial<CustomBlock>;
    if (typeof id !== 'string' || (scheduleId !== null && typeof scheduleId !== 'string')) return false;
    try {
        customBlockFromDraft(customBlockToDraft(block as CustomBlock), scheduleId ?? '', id);
        return true;
    } catch {
        return false;
    }
}

export function selectCustomBlocks(blocks: unknown, scheduleId: string): CustomBlock[] {
    if (!Array.isArray(blocks)) return [];
    return blocks.filter(
        (block): block is CustomBlock =>
            isValidCustomBlock(block) && (block.scheduleId === null || block.scheduleId === scheduleId)
    );
}

export function getCustomBlockConflicts(
    meetings: Pick<CourseMeeting, 'days' | 'startTime' | 'endTime'>[],
    blocks: CustomBlock[]
): CustomBlock[] {
    return blocks.filter(
        block =>
            block.conflictHighlight &&
            meetings.some(
                meeting =>
                    block.days.some(day => meeting.days.includes(day)) &&
                    (block.allDay || (block.startTime < meeting.endTime && block.endTime > meeting.startTime))
            )
    );
}
