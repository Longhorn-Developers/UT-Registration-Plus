import type { HexColor } from './Color';
import type { Day } from './CourseMeeting';

export interface CustomBlockDraft {
    name: string;
    days: Day[];
    startTime: number;
    endTime: number;
    allDay: boolean;
    syncAcrossAllSchedules: boolean;
    conflictHighlight: boolean;
    color?: HexColor;
}

export interface CustomBlock extends Omit<CustomBlockDraft, 'syncAcrossAllSchedules'> {
    id: string;
    scheduleId: string | null;
    /** The synced block this copy was split from when it was unsynced, until the copy is edited */
    unsyncedFrom?: string;
}
