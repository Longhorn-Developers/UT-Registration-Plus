import type { CourseItem, SemesterItem } from '@shared/types/CourseData';

/**
 * Fetches course numbers from the UT Planner API.
 *
 * @param semester - The semester for which to fetch course numbers.
 * @param studyFieldId - The ID of the study field.
 *
 * @returns A promise that resolves to json of courses.
 */
export default async function fetchCourseNumbers(
    semester: SemesterItem,
    fieldOfStudyId: string
): Promise<string | undefined> {
    const formattedSemester = `${semester.year}%20${semester.season}`;
    const formattedStudyFieldId = fieldOfStudyId.replace(' ', '%20');
    const url = `https://utexas.collegescheduler.com/api/terms/${formattedSemester}/subjects/${formattedStudyFieldId}/courses`;

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
        fieldOfStudyId,
        courseNumber: item.id.split('|')[1] || '',
        courseName: item.displayTitle,
        label: `${item.subjectId} ${item.displayTitle}`,
        sections: [],
    })) as CourseItem[];

    return JSON.stringify(processedData);
}
