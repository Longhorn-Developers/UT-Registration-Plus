import { background } from '@shared/messages';
import { parseSemesterCode,type Semester } from '@shared/types/Course';

/**
 * Fetches the available semester codes from UT's registrar schedules page.
 *
 * Scrapes the registrar website for semester schedule links and parses
 * each into a Semester object. Returns an empty array on failure.
 */
export async function fetchAvailableSemesters(): Promise<Semester[]> {
    try {
        const htmlText = await background.addCourseByURL({
            url: 'https://registrar.utexas.edu/schedules',
            method: 'GET',
            response: 'text',
        });

        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        const links = doc.querySelectorAll('a[href*="/schedules/"]');

        const semesterCodes = new Set<string>();
        links.forEach(link => {
            const match = link.getAttribute('href')?.match(/\/schedules\/(\d{3})$/);
            if (match?.[1]) {
                semesterCodes.add(`20${match[1]}`);
            }
        });

        return [...semesterCodes].map(parseSemesterCode).filter((s): s is Semester => s !== undefined);
    } catch (e) {
        console.error('Failed to fetch available semesters', e);
        return [];
    }
}
