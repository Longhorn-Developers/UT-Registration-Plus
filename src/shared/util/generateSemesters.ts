import type { Semester } from '../types/Course';
import type { SemesterItem } from '../types/CourseData';

const TERM_TO_ID_MAP = {
    Spring: 2,
    Summer: 6,
    Fall: 9,
};

/**
 * generateSemesters
 *
 * A function that generates fields for all semesters between the two given semesters, inclusive.
 *
 * fromSemester - the starting semester
 * toSemester - the ending semester (inclusive)
 *
 * @returns a list of items of these terms, along with their corresponding ids.
 */
export function generateSemesters(fromSemester: Semester, toSemester: Semester): SemesterItem[] {
    // Capitalize the first letter of a string
    const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

    // Generate a single field for a given year and semester
    const generateField = (semester: Semester): SemesterItem => {
        const id = `${semester.year}${TERM_TO_ID_MAP[semester.season]}`;
        const label = `${capitalize(semester.season)}, ${semester.year}`;
        return { id, label, ...semester, code: id };
    };

    if (
        fromSemester.year > toSemester.year ||
        (fromSemester.year === toSemester.year &&
            TERM_TO_ID_MAP[fromSemester.season] > TERM_TO_ID_MAP[toSemester.season])
    ) {
        return [];
    }

    const result: SemesterItem[] = [];
    for (let { year } = fromSemester; year <= toSemester.year; year++) {
        const seasons = Array.from(Object.keys(TERM_TO_ID_MAP).values());

        if (year === fromSemester.year) {
            seasons.splice(0, seasons.indexOf(fromSemester.season));
        }

        if (year === toSemester.year) {
            seasons.splice(seasons.indexOf(toSemester.season) + 1);
        }

        for (const season of seasons) {
            result.push(generateField({ year, season } as Semester));
        }
    }

    return result.reverse();
}
