import type { Course } from '@shared/types/Course';
import type { SerializedCustomTimeBlock } from '@shared/types/CustomTimeBlock';
import { customTimeBlockAsMeeting } from '@shared/types/CustomTimeBlock';

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
