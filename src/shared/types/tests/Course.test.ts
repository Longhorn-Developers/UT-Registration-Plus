import { describe, expect, it } from 'vitest';

import { Course } from '../Course';

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
