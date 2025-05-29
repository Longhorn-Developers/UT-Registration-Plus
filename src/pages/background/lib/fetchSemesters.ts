import type { SemesterItem } from '@shared/types/CourseData';

const ID_TO_TERM_MAP = {
    '2': 'Spring',
    '6': 'Summer',
    '9': 'Fall',
} as const;

/**
 * Fetches semesters available from the UT Planner API.
 *
 * @returns A promise that resolves to json of semesters.
 */
export default async function fetchSemesters(): Promise<string> {
    const url = 'https://utexas.collegescheduler.com/api/terms';

    const data = await fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching semesters:', error);
            throw error;
        });

    if (!data) {
        throw new Error('No data returned from fetch');
    }

    const processedData = data.map((item: { id: string; title: string; code: string }) => ({
        id: item.id,
        label: item.title,
        code: item.code,
        year: parseInt(item.id.slice(0, 4), 10),
        season: ID_TO_TERM_MAP[item.code[item.code.length - 1] as keyof typeof ID_TO_TERM_MAP],
        courses: [],
    })) as SemesterItem[];

    return JSON.stringify(processedData);
}
