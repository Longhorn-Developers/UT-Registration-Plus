import fetchCourseNumbers from '@pages/background/lib/fetchCourses';
import fetchSections from '@pages/background/lib/fetchSections';
import { CourseDataStore } from '@shared/storage/courseDataStore';
import type { CourseItem, SectionItem, SemesterItem } from '@shared/types/CourseData';
import { tryCatch } from '@shared/util/tryCatch';

/**
 * A type that represents a field with an id and label
 */
export const FetchStatus = {
    LOADING: 'LOADING',
    DONE: 'DONE',
    ERROR: 'ERROR',
} as const satisfies Record<string, string>;

/**
 * A type that represents the status of a fetch operation.
 *
 * This type is used to indicate the current status of a fetch operation,
 * such as loading, done, or error.
 */
export type FetchStatusType = (typeof FetchStatus)[keyof typeof FetchStatus];

/**
 * A service that handles fetching and caching course data from UT.
 *
 * This service interacts with a local store to cache data and avoid unnecessary API calls.
 * It provides methods to retrieve the courses & sections info for a given semester.
 */
export class CourseDataService {
    /**
     * Retrieves course numbers for a specific study field
     *
     * @param semester - The semester for which to fetch course numbers.
     * @param fieldOfStudyId - The ID of the study field, e.g. "C S" or "ECE".
     *
     * @returns A promise that resolves to FetchStatusType indicating the status of the fetch operation.
     */
    static async getCourseNumbers(semester: SemesterItem, fieldOfStudyId: string): Promise<FetchStatusType> {
        const data = await CourseDataStore.get('courseData');

        data[semester.id] = data[semester.id] || { info: semester, courses: [] };

        const curCourses = data[semester.id]!.courses.filter(
            (course: CourseItem) => course.fieldOfStudyId === fieldOfStudyId
        );

        if (curCourses.length === 0) {
            const [fetchedNewCourses, err] = await tryCatch(fetchCourseNumbers(semester, fieldOfStudyId));
            if (err) {
                console.error('Failed to set course data in store', err);
                return FetchStatus.ERROR;
            }
            const newCourses = JSON.parse(fetchedNewCourses ?? '[]') as CourseItem[];
            newCourses.forEach(course => {
                data[semester.id]!.courses.push(course);
            });
            await CourseDataStore.set('courseData', data);
        }

        return FetchStatus.DONE;
    }

    /**
     * Retrieves sections for a specific course number
     *
     * @param semester - The semester for which to fetch sections.
     * @param courseNumber - The course number for which to fetch sections.
     *
     * @returns A promise that resolves to FetchStatusType indicating the status of the fetch operation.
     */
    static async getSections(semester: SemesterItem, courseNumber: CourseItem): Promise<FetchStatusType> {
        const data = await CourseDataStore.get('courseData');

        data[semester.id] = data[semester.id] || { info: semester, courses: [] };
        const curCourse = data[semester.id]!.courses.find((course: CourseItem) => course.id === courseNumber.id);

        if (!curCourse) {
            console.error('Course not found in data:', courseNumber);
            return FetchStatus.ERROR;
        }

        const curSections = curCourse.sections;
        if (curSections.length === 0) {
            const [fetchedNewSections, err] = await tryCatch(fetchSections(semester, curCourse));
            if (err) {
                console.error('Failed to set course data in store', err);
                return FetchStatus.ERROR;
            }
            const newSections = JSON.parse(fetchedNewSections ?? '[]') as SectionItem[];
            newSections.forEach(section => {
                curCourse.sections.push(section);
            });
            await CourseDataStore.set('courseData', data);
        }

        return FetchStatus.DONE;
    }
}
