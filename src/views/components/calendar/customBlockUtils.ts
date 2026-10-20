import type { Day } from '@shared/types/CourseMeeting';
import type { CustomBlockDraft } from '@shared/types/CustomBlock';

export function minuteAtPosition(offset: number, height: number, start: number, end: number): number {
    const minutes = start + (offset / height) * (end - start);
    return Math.min(end, 1440 - 15, Math.max(start, Math.round(minutes / 15) * 15));
}

export const BLOCK_DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
] as const satisfies readonly Day[];

export const DEFAULT_BLOCK = {
    name: '',
    days: [],
    startTime: 480,
    endTime: 540,
    allDay: false,
    syncAcrossAllSchedules: false,
    conflictHighlight: true,
} satisfies CustomBlockDraft;

export function parseBlockTime(value: string): number | null {
    const match = value.trim().match(/^(\d{1,2}):([0-5]\d)\s*(am|pm)?$/i);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3]?.toLowerCase();
    if (period ? hours < 1 || hours > 12 : hours > 23) return null;
    return (period ? (hours % 12) + (period === 'pm' ? 12 : 0) : hours) * 60 + minutes;
}

export function formatBlockTime(minutes: number): string {
    const hour = Math.floor(minutes / 60);
    return `${hour % 12 || 12}:${String(minutes % 60).padStart(2, '0')}${hour < 12 ? 'am' : 'pm'}`;
}
