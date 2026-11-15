import { getCourseSectionsUrl } from '@shared/util/courseUrls';
import { describe, expect, it } from 'vitest';

const BASE = 'https://utdirect.utexas.edu/apps/registrar/course_schedule';

describe('getCourseSectionsUrl', () => {
    it('links to the search results for every section of the course', () => {
        expect(getCourseSectionsUrl({ url: `${BASE}/20269/54975/`, department: 'C S', number: '314' })).toBe(
            `${BASE}/20269/results/?search_type_main=COURSE&fos_cn=C+S&course_number=314`
        );
    });

    it('handles a course url that is already a results page', () => {
        expect(
            getCourseSectionsUrl({
                url: `${BASE}/20269/results/?fos_fl=C+S&level=U&search_type_main=FIELD`,
                department: 'C S',
                number: '314',
            })
        ).toBe(`${BASE}/20269/results/?search_type_main=COURSE&fos_cn=C+S&course_number=314`);
    });

    it('encodes special characters in the department and course number', () => {
        expect(getCourseSectionsUrl({ url: `${BASE}/20269/50000/`, department: 'A&B', number: '1#2' })).toBe(
            `${BASE}/20269/results/?search_type_main=COURSE&fos_cn=A%26B&course_number=1%232`
        );
    });
});
