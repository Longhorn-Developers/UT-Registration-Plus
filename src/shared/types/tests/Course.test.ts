import { describe, expect, it } from 'vitest';

import { Course, getPreviousSemester, getRecentSemesters, getRegistrationSemester } from '../Course';

describe('getRegistrationSemester', () => {
    it.each([
        [new Date(2027, 0, 1), '20272'], // Jan 1 -> this year's Spring
        [new Date(2027, 1, 28), '20272'], // last day before Fall cutover
        [new Date(2027, 2, 1), '20279'], // Mar 1 -> this year's Fall
        [new Date(2027, 8, 30), '20279'], // last day before Spring cutover
        [new Date(2027, 9, 1), '20282'], // Oct 1 -> next year's Spring
        [new Date(2027, 11, 31), '20282'], // Dec 31 still next year's Spring
    ])('%s -> %s', (date, code) => {
        expect(getRegistrationSemester(date).code).toBe(code);
    });
});

describe('getPreviousSemester', () => {
    it('steps back one term, wrapping Spring to the previous Fall', () => {
        expect(getPreviousSemester({ year: 2027, season: 'Spring' })).toEqual({
            year: 2026,
            season: 'Fall',
            code: '20269',
        });
        expect(getPreviousSemester({ year: 2026, season: 'Fall' })).toEqual({
            year: 2026,
            season: 'Summer',
            code: '20266',
        });
        expect(getPreviousSemester({ year: 2026, season: 'Summer' })).toEqual({
            year: 2026,
            season: 'Spring',
            code: '20262',
        });
    });
});

describe('getRecentSemesters', () => {
    it('returns the registration term and the 3 terms before it', () => {
        expect(getRecentSemesters(new Date(2026, 10, 27)).map(s => s.code)).toEqual([
            '20272',
            '20269',
            '20266',
            '20262',
        ]);
        expect(getRecentSemesters(new Date(2027, 3, 15)).map(s => s.code)).toEqual([
            '20279',
            '20276',
            '20272',
            '20269',
        ]);
    });
});

describe('Course::cleanSummerTerm', () => {
    it("shouldn't affect already cleaned summer terms", () => {
        const inputs = [
            ['C S', '314H'],
            ['P R', 'f378'],
            ['P S', 'f303'],
            ['WGS', 's301'],
            ['S W', 'n360K'],
            ['GOV', 'w312L'],
            ['J', 's311F'],
            ['J S', '311F'],
        ] as const;
        const expected = [
            { department: 'C S', number: '314H' },
            { department: 'P R', number: 'f378' },
            { department: 'P S', number: 'f303' },
            { department: 'WGS', number: 's301' },
            { department: 'S W', number: 'n360K' },
            { department: 'GOV', number: 'w312L' },
            { department: 'J', number: 's311F' },
            { department: 'J S', number: '311F' },
        ];

        const results = inputs.map(input => Course.cleanSummerTerm(input[0], input[1]));

        expect(results).toEqual(expected);
    });

    it('should move summer term indicator to course number', () => {
        const inputs = [
            ['P R f', '378'],
            ['P S f', '303'],
            ['WGS s', '301'],
            ['S W n', '360K'],
            ['GOV w', '312L'],
            ['J s', '311F'],
            ['J S', '311F'],
        ] as const;
        const expected = [
            { department: 'P R', number: 'f378' },
            { department: 'P S', number: 'f303' },
            { department: 'WGS', number: 's301' },
            { department: 'S W', number: 'n360K' },
            { department: 'GOV', number: 'w312L' },
            { department: 'J', number: 's311F' },
            { department: 'J S', number: '311F' },
        ];

        const results = inputs.map(input => Course.cleanSummerTerm(input[0], input[1]));

        expect(results).toEqual(expected);
    });
});
