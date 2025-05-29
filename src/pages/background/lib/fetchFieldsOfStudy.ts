import type { FieldOfStudyItem, SemesterItem } from '@shared/types/CourseData';

/**
 * Fetches all fields of study from the UT Planner API for a given semester.
 *
 * @param semester - The semester for which to fetch fields of study.
 *
 * @returns A promise that resolves to json of fields of study.
 */
export default async function fetchAllFieldsOfStudy(semester: SemesterItem): Promise<string> {
    const formattedSemester = `${semester.year}%20${semester.season}`;
    const url = `https://utexas.collegescheduler.com/api/terms/${formattedSemester}/subjects`;

    const data = await fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching fields of study:', error);
            throw error;
        });

    if (!data) {
        throw new Error('No data returned from fetch');
    }

    const processedData = data.map((item: { id: string; short: string; long: string; title: string }) => ({
        id: item.id,
        name: item.long,
        label: item.title,
    })) as FieldOfStudyItem[];

    return JSON.stringify(processedData);
}
