import type { Day } from './CourseMeeting';

export interface CustomBlockDraft {
    name: string;
    days: Day[];
    startTime: number;
    endTime: number;
    allDay: boolean;
    syncAcrossAllSchedules: boolean;
    conflictHighlight: boolean;
}

export interface CustomBlock extends Omit<CustomBlockDraft, 'syncAcrossAllSchedules'> {
    id: string;
    scheduleId: string | null;
}
