import type { Serialized } from '@chrome-extension-toolkit';

import type { Day } from './CourseMeeting';
import { CourseMeeting } from './CourseMeeting';

/**
 * A user-defined time range (e.g. work or personal hours) shown on the calendar
 * and optionally used to flag catalog course time conflicts.
 */
export type SerializedCustomTimeBlock = {
    id: string;
    title: string;
    days: Day[];
    startTime: number;
    endTime: number;
    /** When true, the block spans each selected weekday for the full visible grid range (and all day for conflicts). */
    allDay?: boolean;
    /** When true, the block appears on every schedule; when false, only on {@link scheduleId}. */
    syncAcrossAllSchedules: boolean;
    /** When true, catalog rows use the same conflict highlight when times overlap this block. */
    highlightCatalogConflicts: boolean;
    /** Owning schedule when {@link syncAcrossAllSchedules} is false. */
    scheduleId: string;
};

/**
 * @returns A {@link CourseMeeting} with the same days/times as this custom block (no location).
 */
export function customTimeBlockAsMeeting(block: SerializedCustomTimeBlock): CourseMeeting {
    if (block.allDay) {
        return new CourseMeeting({
            days: block.days,
            startTime: 0,
            endTime: 1440,
        } satisfies Serialized<CourseMeeting>);
    }

    return new CourseMeeting({
        days: block.days,
        startTime: block.startTime,
        endTime: block.endTime,
    } satisfies Serialized<CourseMeeting>);
}
