import { describe, expect, it } from 'vitest';

import { getUsefulLinks } from '../usefulLinks';

describe('getUsefulLinks', () => {
    it('starts with the registration term and the 3 terms before it', () => {
        const links = getUsefulLinks(new Date(2026, 10, 27)).slice(0, 4);

        expect(links).toEqual([
            {
                text: "Spring '27 Course Schedule",
                url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20272/',
            },
            {
                text: "Fall '26 Course Schedule",
                url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20269/',
            },
            {
                text: "Summer '26 Course Schedule",
                url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20266/',
            },
            {
                text: "Spring '26 Course Schedule",
                url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20262/',
            },
        ]);
    });

    it('rolls the academic calendar link over on Aug 1', () => {
        const findCalendar = (date: Date) => getUsefulLinks(date).find(link => link.text.endsWith('Academic Calendar'));

        expect(findCalendar(new Date(2026, 6, 31))).toEqual({
            text: "'25–'26 Academic Calendar",
            url: 'https://registrar.utexas.edu/calendars/25-26',
        });
        expect(findCalendar(new Date(2026, 7, 1))).toEqual({
            text: "'26–'27 Academic Calendar",
            url: 'https://registrar.utexas.edu/calendars/26-27',
        });
    });
});
