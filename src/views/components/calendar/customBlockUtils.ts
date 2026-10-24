import type { Day } from '@shared/types/CourseMeeting';
import type { CustomBlockDraft } from '@shared/types/CustomBlock';

export function minuteAtPosition(offset: number, height: number, start: number, end: number): number {
    const minutes = start + (offset / height) * (end - start);
    return Math.min(end, 1260, Math.max(start, 480, Math.round(minutes / 15) * 15));
}

export const BLOCK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const satisfies readonly Day[];

export const DEFAULT_BLOCK = {
    name: '',
    days: [],
    startTime: 480,
    endTime: 540,
    allDay: false,
    syncAcrossAllSchedules: true,
    conflictHighlight: true,
} satisfies CustomBlockDraft;

export function parseBlockTime(value: string): number | null {
    const match = value.trim().match(/^(\d{1,2}):([0-5]\d)\s*(am|pm)?$/i);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3]?.toLowerCase();
    if (period ? hours < 1 || hours > 12 : hours > 23) return null;
    const total = (period ? (hours % 12) + (period === 'pm' ? 12 : 0) : hours) * 60 + minutes;
    // Not clamped to the 8am–9pm grid so the form can report out-of-range times instead of silently correcting them
    return Math.min(1425, Math.round(total / 15) * 15);
}

export function isBlockTimeInRange(minutes: number): boolean {
    return minutes >= 480 && minutes <= 1260;
}

export function formatBlockTime(minutes: number): string {
    const hour = Math.floor(minutes / 60);
    return `${hour % 12 || 12}:${String(minutes % 60).padStart(2, '0')}${hour < 12 ? 'am' : 'pm'}`;
}
