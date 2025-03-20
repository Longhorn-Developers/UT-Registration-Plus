import { describe, expect, it } from 'vitest';
import {
    formatToHHMMSS,
    nextDayInclusive,
    englishStringifyList,
    allDatesInRanges,
    meetingToIcsString,
    scheduleToIcsString,
} from './utils';
import { format as formatDate, parseISO } from 'date-fns';
import { tz } from '@date-fns/tz';
import {
    chatterjeeCS429Course,
    multiMeetingMultiInstructorCourse,
    multiMeetingMultiInstructorSchedule,
} from 'src/stories/injected/mocked';
import { Serialized } from 'chrome-extension-toolkit';

// Do all timezone calculations relative to UT's timezone
const TIMEZONE = 'America/Chicago';
const TZ = tz(TIMEZONE);

// Date and datetime formats used by iCal
const ISO_DATE_FORMAT = 'yyyy-MM-dd';
const ISO_BASIC_DATETIME_FORMAT = "yyyyMMdd'T'HHmmss";

/**
 * Simulate serialized class instance, without the class's methods
 *
 * serde &lt;-- Serialize, Deserialize
 */
const serde = <T>(data: T) => JSON.parse(JSON.stringify(data)) as Serialized<T>;

describe('formatToHHMMSS', () => {
    it('should format minutes to HHMMSS format', () => {
        const minutes = 125;
        const expected = '020500';
        const result = formatToHHMMSS(minutes);
        expect(result).toBe(expected);
    });

    it('should handle single digit minutes', () => {
        const minutes = 5;
        const expected = '000500';
        const result = formatToHHMMSS(minutes);
        expect(result).toBe(expected);
    });

    it('should handle zero minutes', () => {
        const minutes = 0;
        const expected = '000000';
        const result = formatToHHMMSS(minutes);
        expect(result).toBe(expected);
    });
});

describe('nextDayInclusive', () => {
    it('should return the same date if the given day is the same as the target day', () => {
        const date = parseISO('2024-01-01', { in: TZ }); // Monday
        const day = 1; // Monday
        const result = nextDayInclusive(date, day);
        expect(formatDate(result, ISO_DATE_FORMAT)).toBe('2024-01-01');
    });

    it('should return the next day if the given day is not the same as the target day', () => {
        const date = parseISO('2024-07-18', { in: TZ }); // Thursday
        const day = 2; // Tuesday
        const result = nextDayInclusive(date, day);
        expect(formatDate(result, ISO_DATE_FORMAT)).toBe('2024-07-23');
    });

    it('should wrap around years', () => {
        const date = parseISO('2025-12-28', { in: TZ }); // Sunday
        const day = 5; // Friday
        const result = nextDayInclusive(date, day);
        expect(formatDate(result, ISO_DATE_FORMAT)).toBe('2026-01-02');
    });

    it('should handle leap day', () => {
        const date = parseISO('2024-02-27', { in: TZ }); // Tuesday
        const day = 4; // Thursday
        const result = nextDayInclusive(date, day);
        expect(formatDate(result, ISO_DATE_FORMAT)).toBe('2024-02-29');
    });

    it('should handle an entire week of inputs', () => {
        const date = parseISO('2024-08-20', { in: TZ }); // Tuesday
        const days = [0, 1, 2, 3, 4, 5, 6] as const;
        const results = days.map(day => nextDayInclusive(date, day));
        const resultsFormatted = results.map(result => formatDate(result, ISO_DATE_FORMAT));
        const expectedResults = [
            '2024-08-25',
            '2024-08-26',
            '2024-08-20', // Same date
            '2024-08-21',
            '2024-08-22',
            '2024-08-23',
            '2024-08-24',
        ];

        for (let i = 0; i < days.length; i++) {
            expect(resultsFormatted[i]).toBe(expectedResults[i]);
        }
    });

    it('should maintain hours/minutes/seconds', () => {
        const date = parseISO('20250115T143021', { in: TZ }); // Wednesday
        const days = [0, 1, 2, 3, 4, 5, 6] as const;
        const results = days.map(day => nextDayInclusive(date, day));
        const resultsFormatted = results.map(result => formatDate(result, ISO_BASIC_DATETIME_FORMAT));
        const expectedResults = [
            '20250119T143021',
            '20250120T143021',
            '20250121T143021',
            '20250115T143021',
            '20250116T143021',
            '20250117T143021',
            '20250118T143021',
        ];

        for (let i = 0; i < days.length; i++) {
            expect(resultsFormatted[i]).toBe(expectedResults[i]);
        }
    });
});

describe('englishStringifyList', () => {
    it('should handle an empty array', () => {
        const data = [] satisfies string[];
        const result = englishStringifyList(data);
        const expected = '';
        expect(result).toBe(expected);
    });

    it('should handle 1 element', () => {
        const data = ['Alice'] satisfies string[];
        const result = englishStringifyList(data);
        const expected = 'Alice';
        expect(result).toBe(expected);
    });

    it('should handle 2 elements', () => {
        const data = ['Alice', 'Bob'] satisfies string[];
        const result = englishStringifyList(data);
        const expected = 'Alice and Bob';
        expect(result).toBe(expected);
    });

    it('should handle 3 elements', () => {
        const data = ['Alice', 'Bob', 'Charlie'] satisfies string[];
        const result = englishStringifyList(data);
        const expected = 'Alice, Bob, and Charlie';
        expect(result).toBe(expected);
    });

    it('should handle n elements', () => {
        const testcases = [
            { data: [], expected: '' },
            { data: ['foo'], expected: 'foo' },
            { data: ['foo', 'bar'], expected: 'foo and bar' },
            { data: ['foo', 'bar', 'baz'], expected: 'foo, bar, and baz' },
            { data: ['a', 'b', 'c', 'd'], expected: 'a, b, c, and d' },
            { data: 'abcdefghijk'.split(''), expected: 'a, b, c, d, e, f, g, h, i, j, and k' },
        ] satisfies { data: string[]; expected: string }[];

        for (const { data, expected } of testcases) {
            const result = englishStringifyList(data);
            expect(result).toBe(expected);
        }
    });
});

describe('allDatesInRanges', () => {
    it('should handle empty array', () => {
        const dateRanges = [] satisfies string[];
        const result = allDatesInRanges(dateRanges);
        const expected = [] satisfies Date[];
        expect(result).toEqual(expected);
    });

    it('should handle a single date', () => {
        const dateRanges = ['2025-03-14'] satisfies (string | [string, string])[];
        const result = allDatesInRanges(dateRanges);
        const expected = ['2025-03-14'].map(dateStr => parseISO(dateStr, { in: TZ })) satisfies Date[];
        expect(result).toEqual(expected);
    });

    it('should handle a single date', () => {
        const dateRanges = ['2025-03-14'] satisfies string[];
        const result = allDatesInRanges(dateRanges);
        const expected = ['2025-03-14'].map(dateStr => parseISO(dateStr, { in: TZ })) satisfies Date[];
        expect(result).toEqual(expected);
    });

    it('should handle a single date range', () => {
        const dateRanges = [['2025-03-14', '2025-03-19']] satisfies (string | [string, string])[];
        const result = allDatesInRanges(dateRanges);
        const expected = ['2025-03-14', '2025-03-15', '2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].map(
            dateStr => parseISO(dateStr, { in: TZ })
        ) satisfies Date[];
        expect(result).toEqual(expected);
    });

    it('should handle multiple dates/date ranges', () => {
        const dateRanges = [
            '2025-02-14',
            ['2025-03-14', '2025-03-19'],
            '2026-12-01',
            ['2026-12-03', '2026-12-05'],
        ] satisfies (string | [string, string])[];
        const result = allDatesInRanges(dateRanges);
        const expected = [
            '2025-02-14', // '2025-02-14'
            '2025-03-14', // ['2025-03-14', '2025-03-19']
            '2025-03-15',
            '2025-03-16',
            '2025-03-17',
            '2025-03-18',
            '2025-03-19',
            '2026-12-01', // '2026-12-01'
            '2026-12-03', // ['2026-12-03', '2026-12-05'
            '2026-12-04',
            '2026-12-05',
        ].map(dateStr => parseISO(dateStr, { in: TZ })) satisfies Date[];
        expect(result).toEqual(expected);
    });

    it('should handle month-/year-spanning ranges', () => {
        const dateRanges = [
            ['2023-02-27', '2023-03-02'],
            ['2023-12-27', '2024-01-03'],
        ] satisfies (string | [string, string])[];
        console.log(dateRanges);
        const result = allDatesInRanges(dateRanges);
        console.log(result);
        const expected = [
            '2023-02-27', // ['2023-02-27', '2023-03-2']
            '2023-02-28',
            '2023-03-01',
            '2023-03-02',
            '2023-12-27', // ['2023-12-27', '2024-01-3']
            '2023-12-28',
            '2023-12-29',
            '2023-12-30',
            '2023-12-31',
            '2024-01-01',
            '2024-01-02',
            '2024-01-03',
        ].map(dateStr => parseISO(dateStr, { in: TZ })) satisfies Date[];
        expect(result).toEqual(expected);
    });

    it('should handle leap years', () => {
        const dateRanges = [
            ['2023-02-27', '2023-03-02'],
            ['2024-02-27', '2024-03-02'],
            ['2025-02-27', '2025-03-02'],
        ] satisfies (string | [string, string])[];
        const result = allDatesInRanges(dateRanges);
        const expected = [
            '2023-02-27', // ['2023-02-27', '2023-03-2']
            '2023-02-28',
            '2023-03-01',
            '2023-03-02',
            '2024-02-27', // ['2024-02-27', '2024-03-2']
            '2024-02-28',
            '2024-02-29',
            '2024-03-01',
            '2024-03-02',
            '2025-02-27', // ['2025-02-27', '2025-03-2']
            '2025-02-28',
            '2025-03-01',
            '2025-03-02',
        ].map(dateStr => parseISO(dateStr, { in: TZ })) satisfies Date[];
        expect(result).toEqual(expected);
    });
});

describe('meetingToIcsString', () => {
    it('should handle a one-day meeting with one instructor', () => {
        const course = serde(multiMeetingMultiInstructorCourse);
        course.instructors = course.instructors.slice(0, 1);
        const meeting = course.schedule.meetings[1]!;
        const result = meetingToIcsString(course, meeting);
        const expected = (
            `BEGIN:VEVENT
            DTSTART;TZID=America/Chicago:20250829T130000
            DTEND;TZID=America/Chicago:20250829T160000
            RRULE:FREQ=WEEKLY;BYDAY=FR;UNTIL=20251209T060000Z
            EXDATE;TZID=America/Chicago:20251128T130000
            ` +
            // Only skips one Thanksgiving break day
            `SUMMARY:J 395 44-REPORTING TEXAS
            LOCATION:DMC 3.208
            DESCRIPTION:Unique number: 10335\\nTaught by John Schwartz
            END:VEVENT`
        ).replaceAll(/^\s+/gm, '');
        expect(result).toBe(expected);
    });

    it('should handle unique numbers below 5 digits', () => {
        const course = serde(multiMeetingMultiInstructorCourse);
        course.instructors = course.instructors.slice(0, 1);
        course.uniqueId = 4269;
        const meeting = course.schedule.meetings[1]!;
        const result = meetingToIcsString(course, meeting);
        const expected = `BEGIN:VEVENT
            DTSTART;TZID=America/Chicago:20250829T130000
            DTEND;TZID=America/Chicago:20250829T160000
            RRULE:FREQ=WEEKLY;BYDAY=FR;UNTIL=20251209T060000Z
            EXDATE;TZID=America/Chicago:20251128T130000
            SUMMARY:J 395 44-REPORTING TEXAS
            LOCATION:DMC 3.208
            DESCRIPTION:Unique number: 04269\\nTaught by John Schwartz
            END:VEVENT`.replaceAll(/^\s+/gm, '');
        expect(result).toBe(expected);
    });

    it('should handle a one-day meeting with multiple instructors', () => {
        const course = serde(multiMeetingMultiInstructorCourse);
        const meeting = course.schedule.meetings[1]!;
        const result = meetingToIcsString(course, meeting);
        const expected = `BEGIN:VEVENT
            DTSTART;TZID=America/Chicago:20250829T130000
            DTEND;TZID=America/Chicago:20250829T160000
            RRULE:FREQ=WEEKLY;BYDAY=FR;UNTIL=20251209T060000Z
            EXDATE;TZID=America/Chicago:20251128T130000
            SUMMARY:J 395 44-REPORTING TEXAS
            LOCATION:DMC 3.208
            DESCRIPTION:Unique number: 10335\\nTaught by John Schwartz and John Bridges
            END:VEVENT`.replaceAll(/^\s+/gm, '');
        expect(result).toBe(expected);
    });

    it('should handle a multi-day meeting with multiple instructors', () => {
        const course = serde(multiMeetingMultiInstructorCourse);
        const meeting = course.schedule.meetings[0]!;
        const result = meetingToIcsString(course, meeting);
        const expected = `BEGIN:VEVENT
            DTSTART;TZID=America/Chicago:20250826T093000
            DTEND;TZID=America/Chicago:20250826T110000
            RRULE:FREQ=WEEKLY;BYDAY=TU,TH;UNTIL=20251209T060000Z
            EXDATE;TZID=America/Chicago:20251125T093000,20251127T093000
            SUMMARY:J 395 44-REPORTING TEXAS
            LOCATION:CMA 6.146
            DESCRIPTION:Unique number: 10335\\nTaught by John Schwartz and John Bridges
            END:VEVENT`.replaceAll(/^\s+/gm, '');
        expect(result).toBe(expected);
    });
});

describe('scheduleToIcsString', () => {
    it('should handle a single course with multiple meetings', () => {
        const schedule = serde(multiMeetingMultiInstructorSchedule);
        const result = scheduleToIcsString(schedule);
        const expected = `BEGIN:VCALENDAR
            VERSION:2.0
            CALSCALE:GREGORIAN
            X-WR-CALNAME:My Schedule
            BEGIN:VEVENT
            DTSTART;TZID=America/Chicago:20250826T093000
            DTEND;TZID=America/Chicago:20250826T110000
            RRULE:FREQ=WEEKLY;BYDAY=TU,TH;UNTIL=20251209T060000Z
            EXDATE;TZID=America/Chicago:20251125T093000,20251127T093000
            SUMMARY:J 395 44-REPORTING TEXAS
            LOCATION:CMA 6.146
            DESCRIPTION:Unique number: 10335\\nTaught by John Schwartz and John Bridges
            END:VEVENT
            BEGIN:VEVENT
            DTSTART;TZID=America/Chicago:20250829T130000
            DTEND;TZID=America/Chicago:20250829T160000
            RRULE:FREQ=WEEKLY;BYDAY=FR;UNTIL=20251209T060000Z
            EXDATE;TZID=America/Chicago:20251128T130000
            SUMMARY:J 395 44-REPORTING TEXAS
            LOCATION:DMC 3.208
            DESCRIPTION:Unique number: 10335\\nTaught by John Schwartz and John Bridges
            END:VEVENT
            END:VCALENDAR`.replaceAll(/^\s+/gm, '');
        expect(result).toBe(expected);
    });

    it('should handle a complex schedule', () => {
        const schedule = serde(multiMeetingMultiInstructorSchedule);
        schedule.courses.push(chatterjeeCS429Course);
        const result = scheduleToIcsString(schedule);
        const expected = (
            `BEGIN:VCALENDAR
            VERSION:2.0
            CALSCALE:GREGORIAN
            X-WR-CALNAME:My Schedule
            BEGIN:VEVENT
            DTSTART;TZID=America/Chicago:20250826T093000
            DTEND;TZID=America/Chicago:20250826T110000
            RRULE:FREQ=WEEKLY;BYDAY=TU,TH;UNTIL=20251209T060000Z
            EXDATE;TZID=America/Chicago:20251125T093000,20251127T093000
            SUMMARY:J 395 44-REPORTING TEXAS
            LOCATION:CMA 6.146
            DESCRIPTION:Unique number: 10335\\nTaught by John Schwartz and John Bridges
            END:VEVENT
            BEGIN:VEVENT
            DTSTART;TZID=America/Chicago:20250829T130000
            DTEND;TZID=America/Chicago:20250829T160000
            RRULE:FREQ=WEEKLY;BYDAY=FR;UNTIL=20251209T060000Z
            EXDATE;TZID=America/Chicago:20251128T130000
            SUMMARY:J 395 44-REPORTING TEXAS
            LOCATION:DMC 3.208
            DESCRIPTION:Unique number: 10335\\nTaught by John Schwartz and John Bridges
            END:VEVENT
            BEGIN:VEVENT
            DTSTART;TZID=America/Chicago:20250825T160000
            DTEND;TZID=America/Chicago:20250825T170000
            RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH;UNTIL=20251209T060000Z
            ` +
            // Skips Labor Day and only relevant days of Thanksgiving
            `EXDATE;TZID=America/Chicago:20250901T160000,20251124T160000,20251125T160000,20251126T160000,20251127T160000
            SUMMARY:C S 429 COMP ORGANIZATN AND ARCH
            LOCATION:UTC 3.102
            DESCRIPTION:Unique number: 54795\\nTaught by Siddhartha Chatterjee
            END:VEVENT
            BEGIN:VEVENT
            DTSTART;TZID=America/Chicago:20250829T090000
            DTEND;TZID=America/Chicago:20250829T110000
            RRULE:FREQ=WEEKLY;BYDAY=FR;UNTIL=20251209T060000Z
            EXDATE;TZID=America/Chicago:20251128T090000
            SUMMARY:C S 429 COMP ORGANIZATN AND ARCH
            LOCATION:GSB 2.122
            DESCRIPTION:Unique number: 54795\\nTaught by Siddhartha Chatterjee
            END:VEVENT
            END:VCALENDAR`
        ).replaceAll(/^\s+/gm, '');
        expect(result).toBe(expected);
    });
});
