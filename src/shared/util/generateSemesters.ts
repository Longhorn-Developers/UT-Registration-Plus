/**
 * A type that represents a semester in UT
 */
export type Semester = {
    year: number;
    term: 'spring' | 'summer' | 'fall';
};

/**
 * A type that represents a field with an id and label
 */
export type SemesterField = {
    id: string;
    label: string;
};

const TERM_TO_ID_MAP = {
    spring: 2,
    summer: 6,
    fall: 9,
};

/**
 * generateSemesters
 *
 * A function that generates fields for all semesters between the two given semesters, inclusive.
 *
 * fromSemester - the starting semester
 * toSemester - the ending semester (inclusive)
 *
 * @returns a list of fields of these terms, along with their corresponding ids.
 */
export function generateSemesterFields(fromSemester: Semester, toSemester: Semester): SemesterField[] {
    // Capitalize the first letter of a string
    const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

    // Generate a single field for a given year and semester
    const generateField = (semester: Semester): SemesterField => {
        const id = `${semester.year}${TERM_TO_ID_MAP[semester.term]}`;
        const label = `${capitalize(semester.term)}, ${semester.year}`;
        return { id, label };
    };

    if (
        fromSemester.year > toSemester.year ||
        (fromSemester.year === toSemester.year && TERM_TO_ID_MAP[fromSemester.term] > TERM_TO_ID_MAP[toSemester.term])
    ) {
        return [];
    }

    const result: SemesterField[] = [];
    for (let { year } = fromSemester; year <= toSemester.year; year++) {
        const terms = Object.keys(TERM_TO_ID_MAP).values().toArray();

        if (year === fromSemester.year) {
            terms.splice(0, terms.indexOf(fromSemester.term));
        }

        if (year === toSemester.year) {
            terms.splice(terms.indexOf(toSemester.term) + 1);
        }

        for (const term of terms) {
            result.push(generateField({ year, term } as Semester));
        }
    }

    return result.reverse();
}
