import { describe, expect, it } from 'vitest';

import { CourseCatalogScraper } from './CourseCatalogScraper';

describe('CourseCatalogScraper::separateCourseName', () => {
    it('should separate a simple course', () => {
        // UT Formats strings weird... lots of meaningless spaces
        const input = 'C S  314H DATA STRUCTURES: HONORS         ';
        const expected = ['DATA STRUCTURES: HONORS', 'C S', '314H'];
        const result = CourseCatalogScraper.separateCourseName(input);

        expect(result).toEqual(expected);
    });

    it('separate summer courses ', () => {
        // UT Formats strings weird... lots of meaningless spaces
        const inputs = [
            'P R f378 PUBLIC RELATNS TECHNIQUES-IRL  (First term)         ',
            'CRP s396 INDEPENDENT RESEARCH IN CRP  (Second term)         ',
            'B A n284S 1-MANAGERIAL MICROECON-I-DAL  (Nine week term)         ',
            'J w379 JOURNALISM INDEPENDENT STUDY  (Whole term)         ',
        ];

        const expected = [
            ['PUBLIC RELATNS TECHNIQUES-IRL  (First term)', 'P R', 'f378'],
            ['INDEPENDENT RESEARCH IN CRP  (Second term)', 'CRP', 's396'],
            ['1-MANAGERIAL MICROECON-I-DAL  (Nine week term)', 'B A', 'n284S'],
            ['JOURNALISM INDEPENDENT STUDY  (Whole term)', 'J', 'w379'],
        ];
        const results = inputs.map(input => CourseCatalogScraper.separateCourseName(input));

        expect(results).toEqual(expected);
    });
});
