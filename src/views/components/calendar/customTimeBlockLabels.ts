import { CourseMeeting } from '@shared/types/CourseMeeting';
import type { Day } from '@shared/types/CourseMeeting';

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

export function sortDaysByWeek(days: Day[]): Day[] {
    return [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
}

export function compactDayLetters(days: Day[]): string {
    return sortDaysByWeek(days)
        .map(d => COMPACT_DAY[d])
        .join('');
}

export function formatCustomBlockTimeRange(startMinutes: number, endMinutes: number): string {
    const meeting = new CourseMeeting({
        days: ['Monday'],
        startTime: startMinutes,
        endTime: endMinutes,
    });
    return meeting.getTimeString({ separator: ' – ' });
}

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
