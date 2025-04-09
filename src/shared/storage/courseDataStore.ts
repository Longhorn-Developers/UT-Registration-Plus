import type { CourseItem, SectionItem, SemesterItem } from '@shared/types/CourseData';
import { createLocalStore, debugStore } from 'chrome-extension-toolkit';

/**
 * An interface that represents the course data store of the fields of study,
 * course numbers, and sections for each semester.
 *
 * The structure is as follows:
 * - semester.id
 *   - info (the semester details)
 *     - courses (the course details)
 *     - section (the section details)
 *
 */
export interface ICourseDataStore {
    courseData: Record<
        string,
        {
            info: SemesterItem;
            sections: SectionItem[];
            courses: CourseItem[];
        }
    >;
}

/**
 * A store that is used for storing user schedules (and the active schedule)
 */
export const CourseDataStore = createLocalStore<ICourseDataStore>({ courseData: {} });

debugStore({ userScheduleStore: CourseDataStore });
