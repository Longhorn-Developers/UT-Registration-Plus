import type { CourseItem, SemesterItem } from '@shared/types/CourseData';
import { createLocalStore, debugStore } from 'chrome-extension-toolkit';

/**
 * An interface that represents the course data store of the fields of study,
 * course numbers, and sections for each semester.
 *
 * The structure is as follows:
 * - semester.id
 *   - info (the semester details)
 *     - courses (all courses in that semester) (filtered by field of study)
 *       - sections (all sections in that course)
 *
 */
export interface ICourseDataStore {
    courseData: Record<
        string,
        {
            info: SemesterItem;
            courses: CourseItem[];
        }
    >;
}

/**
 * A store that is used for storing user schedules (and the active schedule)
 */
export const CourseDataStore = createLocalStore<ICourseDataStore>({ courseData: {} });

debugStore({ userScheduleStore: CourseDataStore });
