import fetchCourseNumbers from '@pages/background/lib/fetchCourses';
import fetchSections from '@pages/background/lib/fetchSections';
import fetchSemesters from '@pages/background/lib/fetchSemesters';
import { CourseDataStore } from '@shared/storage/courseDataStore';
import type { CourseItem, SemesterItem } from '@shared/types/CourseData';
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
     * Retrieves all available semesters from the local store or fetches them if not present.
     *
     * The available semesters are based on the fetched data from the UT Planner API.
     *
     * @returns A promise that resolves to an array of SemesterItem objects.
     */
    static async getAvailableSemesters(): Promise<FetchStatusType> {
        const data = await CourseDataStore.get('semesterData');
        if (!data || data.length === 0) {
            const [fetchedSemesters, err] = await tryCatch(fetchSemesters());
            if (err) {
                console.error('Failed to fetch semesters', err);
                return FetchStatus.ERROR;
            }
            const newSemesters = JSON.parse(fetchedSemesters ?? '[]') as SemesterItem[];
            console.log('Fetched semesters:', newSemesters);
            await CourseDataStore.set(
                'semesterData',
                newSemesters.map(semester => ({ info: semester, courses: [] }))
            );
        }

        return FetchStatus.DONE;
    }

    /**
     * Retrieves course numbers for a specific study field
     *
     * @param semester - The semester for which to fetch course numbers.
     * @param fieldOfStudyId - The ID of the study field, e.g. "C S" or "ECE".
     *
     * @returns A promise that resolves to FetchStatusType indicating the status of the fetch operation.
     */
    static async getCourseNumbers(semester: SemesterItem, fieldOfStudyId: string): Promise<FetchStatusType> {
        const data = await CourseDataStore.get('semesterData');
        const semesterData = data.find(semesterData => semesterData.info.id === semester.id);
        if (
            semesterData &&
            semesterData.courses.find(course => course.fieldOfStudyId === fieldOfStudyId) !== undefined
        ) {
            console.log('Cached course numbers:', semesterData.courses);
            return FetchStatus.DONE;
        }
        const [fetchedCourses, err] = await tryCatch(fetchCourseNumbers(semester, fieldOfStudyId));
        if (err) {
            console.error('Failed to fetch course numbers', err);
            return FetchStatus.ERROR;
        }
        const newCourses = JSON.parse(fetchedCourses ?? '[]') as CourseItem[];
        const semesterIndex = data.findIndex(semesterData => semesterData.info.id === semester.id);
        if (semesterIndex === -1) {
            data.push({ info: semester, courses: newCourses });
        } else {
            data[semesterIndex]!.courses = newCourses;
        }
        await CourseDataStore.set('semesterData', data);
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
        const data = await CourseDataStore.get('semesterData');
        const semesterData = data.find(semesterData => semesterData.info.id === semester.id);
        if (semesterData) {
            const courseIndex = semesterData.courses.findIndex(
                course => course.id === courseNumber.id && course.fieldOfStudyId === courseNumber.fieldOfStudyId
            );
            if (courseIndex !== -1 && semesterData.courses[courseIndex]!.sections.length > 0) {
                console.log('Cached sections:', semesterData.courses[courseIndex]!.sections);
                return FetchStatus.DONE;
            }
        }
        const [fetchedSections, err] = await tryCatch(fetchSections(semester, courseNumber));
        if (err) {
            console.error('Failed to fetch sections', err);
            return FetchStatus.ERROR;
        }
        const newSections = JSON.parse(fetchedSections ?? '[]') as CourseItem[];
        if (semesterData) {
            const courseIndex = semesterData.courses.findIndex(
                course => course.id === courseNumber.id && course.fieldOfStudyId === courseNumber.fieldOfStudyId
            );
            if (courseIndex !== -1) {
                semesterData.courses[courseIndex]!.sections = newSections;
            }
        } else {
            data.push({ info: semester, courses: [{ ...courseNumber, sections: newSections }] });
        }
        await CourseDataStore.set('semesterData', data);
        return FetchStatus.DONE;
    }
}
