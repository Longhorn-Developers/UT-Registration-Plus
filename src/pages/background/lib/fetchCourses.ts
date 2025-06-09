import type { CourseItem, SemesterItem } from '@shared/types/CourseData';

/**
 * Fetches all course numbers from the UT Planner API for a given semester.
 *
 * @param semester - The semester for which to fetch course numbers.
 *
 * @returns A promise that resolves to json of courses.
 */
export default async function fetchAllCourseNumbers(semester: SemesterItem): Promise<string> {
    const formattedSemester = `${semester.year}%20${semester.season}`;
    const url = `https://utexas.collegescheduler.com/api/terms/${formattedSemester}/courses`;

    const data = await fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching course numbers:', error);
            throw error;
        });

    if (!data) {
        throw new Error('No data returned from fetch');
    }

    const processedData = data.map((item: { id: string; subjectId: string; displayTitle: string }) => ({
        id: item.id.replace('|', ' '),
        fieldOfStudyId: item.subjectId,
        courseNumber: item.id.split('|')[1] || '',
        courseName: item.displayTitle,
        label: `${item.subjectId} ${item.displayTitle}`,
        sections: [],
    })) as CourseItem[];

    return JSON.stringify(processedData);
}
