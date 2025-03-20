import { describe, expect, it } from 'vitest';
import { formatToHHMMSS, nextDayInclusive, englishStringifyList } from './utils';
import { parse, getDate, format as formatDate, getDay, Day } from 'date-fns';
import { tz } from '@date-fns/tz';

// Do all timezone calculations relative to UT's timezone
const TIMEZONE = 'America/Chicago';
const TZ = tz(TIMEZONE);

const ISO_DATE_FORMAT = 'yyyy-MM-dd';

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
        const date = parse('2024-01-01', ISO_DATE_FORMAT, new Date()); // Monday
        const day = 1; // Monday
        const result = nextDayInclusive(date, day);
        expect(formatDate(result, ISO_DATE_FORMAT)).toBe('2024-01-01');
    });

    it('should return the next day if the given day is not the same as the target day', () => {
        const date = parse('2024-07-18', ISO_DATE_FORMAT, new Date()); // Thursday
        const day = 2; // Tuesday
        const result = nextDayInclusive(date, day);
        expect(formatDate(result, ISO_DATE_FORMAT)).toBe('2024-07-23');
    });

    it('should wrap around years', () => {
        const date = parse('2025-12-28', ISO_DATE_FORMAT, new Date()); // Sunday
        const day = 5; // Friday
        const result = nextDayInclusive(date, day);
        expect(formatDate(result, ISO_DATE_FORMAT)).toBe('2026-01-02');
    });

    it('should handle leap day', () => {
        const date = parse('2024-02-27', ISO_DATE_FORMAT, new Date()); // Tuesday
        const day = 4; // Thursday
        const result = nextDayInclusive(date, day);
        expect(formatDate(result, ISO_DATE_FORMAT)).toBe('2024-02-29');
    });

    it('should handle an entire week of inputs', () => {
        const date = parse('2024-08-20', ISO_DATE_FORMAT, new Date()); // Tuesday
        const days = [0, 1, 2, 3, 4, 5, 6] as const;
        const results = days.map(day => nextDayInclusive(date, day));
        const resultsFormatted = results.map(result => formatDate(result, ISO_DATE_FORMAT));
        const expectedResults = [
            '2024-08-25',
            '2024-08-26',
            '2024-08-20',
            '2024-08-21',
            '2024-08-22',
            '2024-08-23',
            '2024-08-24',
        ];

        for (let i = 0; i < days.length; i++) {
            expect(resultsFormatted[i]).toBe(expectedResults[i]);
        }
    });
});
