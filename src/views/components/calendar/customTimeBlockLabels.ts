import type { Day } from '@shared/types/CourseMeeting';
import { CourseMeeting } from '@shared/types/CourseMeeting';

/** Mon–Sat row labels matching design (calendar grid still shows Mon–Fri only). */
export const CUSTOM_BLOCK_DAY_TOGGLES: { label: string; day: Day }[] = [
    { label: 'MON', day: 'Monday' },
    { label: 'TUE', day: 'Tuesday' },
    { label: 'WED', day: 'Wednesday' },
    { label: 'THU', day: 'Thursday' },
    { label: 'FRI', day: 'Friday' },
    { label: 'SAT', day: 'Saturday' },
];

const DAY_ORDER = CUSTOM_BLOCK_DAY_TOGGLES.map(t => t.day);

const COMPACT_DAY: Record<Day, string> = {
    Monday: 'M',
    Tuesday: 'T',
    Wednesday: 'W',
    Thursday: 'TH',
    Friday: 'F',
    Saturday: 'SAT',
    Sunday: 'SU',
};

/**
 * Sort selected weekdays Monday-first for display and storage consistency.
 */
export function sortDaysByWeek(days: Day[]): Day[] {
    return [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
}

/**
 * Compact day codes for subtitles (e.g. MW, MWF).
 */
export function compactDayLetters(days: Day[]): string {
    return sortDaysByWeek(days)
        .map(d => COMPACT_DAY[d])
        .join('');
}

/**
 * Human-readable time range for a custom block using the same rules as course meetings.
 */
export function formatCustomBlockTimeRange(startMinutes: number, endMinutes: number): string {
    const meeting = new CourseMeeting({
        days: ['Monday'],
        startTime: startMinutes,
        endTime: endMinutes,
    });
    return meeting.getTimeString({ separator: ' – ' });
}

/**
 * One-line summary for edit UI: days plus time range or all-day label.
 */
export function formatCustomBlockSubtitle(
    days: Day[],
    startMinutes: number,
    endMinutes: number,
    allDay: boolean
): string {
    const letters = compactDayLetters(days);
    if (days.length === 0) {
        return '';
    }
    if (allDay) {
        return `${letters} · All day`;
    }
    return `${letters} at ${formatCustomBlockTimeRange(startMinutes, endMinutes)}`;
}
