import { getCourseSectionsUrl } from '@shared/util/courseUrls';
import { describe, expect, it } from 'vitest';

const BASE = 'https://utdirect.utexas.edu/apps/registrar/course_schedule';
const fall2026 = { year: 2026, season: 'Fall', code: '20269' } as const;

describe('getCourseSectionsUrl', () => {
    it('links to the search results for every section of the course', () => {
        expect(
            getCourseSectionsUrl({ url: `${BASE}/20269/54975/`, department: 'C S', number: '314', semester: fall2026 })
        ).toBe(`${BASE}/20269/results/?search_type_main=COURSE&fos_cn=C+S&course_number=314`);
    });

    it('keeps letter suffixes and summer term prefixes in the course number', () => {
        expect(
            getCourseSectionsUrl({
                url: `${BASE}/20266/85460/`,
                department: 'M',
                number: 'f302',
                semester: { year: 2026, season: 'Summer', code: '20266' },
            })
        ).toBe(`${BASE}/20266/results/?search_type_main=COURSE&fos_cn=M&course_number=f302`);

        expect(
            getCourseSectionsUrl({ url: `${BASE}/20269/50000/`, department: 'C S', number: '314H', semester: fall2026 })
        ).toBe(`${BASE}/20269/results/?search_type_main=COURSE&fos_cn=C+S&course_number=314H`);
    });

    it('handles a course url without a trailing slash', () => {
        expect(
            getCourseSectionsUrl({ url: `${BASE}/20269/50000`, department: 'E E', number: '306', semester: fall2026 })
        ).toBe(`${BASE}/20269/results/?search_type_main=COURSE&fos_cn=E+E&course_number=306`);
    });

    it('handles a course url that is already a results page', () => {
        expect(
            getCourseSectionsUrl({
                url: `${BASE}/20269/results/?fos_fl=C+S&level=U&search_type_main=FIELD`,
                department: 'C S',
                number: '314',
                semester: fall2026,
            })
        ).toBe(`${BASE}/20269/results/?search_type_main=COURSE&fos_cn=C+S&course_number=314`);
    });

    it('falls back to the semester code in the url when the semester has none', () => {
        expect(
            getCourseSectionsUrl({
                url: `${BASE}/20269/50000/`,
                department: 'C S',
                number: '314',
                semester: { year: 2026, season: 'Fall' },
            })
        ).toBe(`${BASE}/20269/results/?search_type_main=COURSE&fos_cn=C+S&course_number=314`);
    });

    it('encodes special characters in the department and course number', () => {
        expect(
            getCourseSectionsUrl({ url: `${BASE}/20269/50000/`, department: 'A&B', number: '1#2', semester: fall2026 })
        ).toBe(`${BASE}/20269/results/?search_type_main=COURSE&fos_cn=A%26B&course_number=1%232`);
    });

    it('returns the original url when no semester can be determined', () => {
        const semester = { year: 2026, season: 'Fall' } as const;
        expect(getCourseSectionsUrl({ url: 'not a url', department: 'C S', number: '314', semester })).toBe(
            'not a url'
        );
        expect(
            getCourseSectionsUrl({ url: 'https://example.com/foo/', department: 'C S', number: '314', semester })
        ).toBe('https://example.com/foo/');
    });
});
