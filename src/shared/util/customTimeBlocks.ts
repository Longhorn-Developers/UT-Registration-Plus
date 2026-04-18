import type { Course } from '@shared/types/Course';
import type { SerializedCustomTimeBlock } from '@shared/types/CustomTimeBlock';
import { customTimeBlockAsMeeting } from '@shared/types/CustomTimeBlock';
import { minutesToTimeInputValue } from '@shared/util/time';

/**
 * Minutes from midnight for the start time shown in `<input type="time">` when a custom block is all-day.
 * The inputs are disabled in that mode; persisted values are still `0`–`1440` (full visible day) on save.
 */
export const CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START_MINUTES = 480;

/**
 * Minutes from midnight for the end time shown in `<input type="time">` when a custom block is all-day.
 */
export const CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END_MINUTES = 9 * 60;

/** `HH:mm` for `<input type="time">` when the block is all-day (display only). */
export const CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START = minutesToTimeInputValue(
    CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START_MINUTES
);

/** `HH:mm` for `<input type="time">` when the block is all-day (display only). */
export const CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END = minutesToTimeInputValue(CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END_MINUTES);

/**
 * Custom blocks that should be shown for a given schedule tab.
 */
export function customTimeBlocksForSchedule(
    blocks: SerializedCustomTimeBlock[],
    scheduleId: string
): SerializedCustomTimeBlock[] {
    return blocks.filter(b => b.syncAcrossAllSchedules || b.scheduleId === scheduleId);
}

/**
 * True when any applicable custom block both requests catalog highlighting and overlaps the course in time.
 */
export function courseConflictsWithHighlightedCustomBlocks(
    course: Course,
    blocks: SerializedCustomTimeBlock[],
    activeScheduleId: string
): boolean {
    const applicable = customTimeBlocksForSchedule(blocks, activeScheduleId);
    const pseudo = applicable.filter(b => b.highlightCatalogConflicts).map(customTimeBlockAsMeeting);

    for (const meeting of course.schedule.meetings) {
        for (const customMeeting of pseudo) {
            if (meeting.isConflicting(customMeeting)) {
                return true;
            }
        }
    }

    return false;
}
