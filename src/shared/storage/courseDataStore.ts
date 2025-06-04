import type { CourseItem, FieldOfStudyItem, SemesterItem } from '@shared/types/CourseData';
import { createLocalStore, debugStore } from 'chrome-extension-toolkit';

/**
 * An interface that represents the course data store of the courses and
 * sections for each available semester.
 *
 * The structure is as follows:
 * - semesterData (array of available semesters)
 *     - info (semester info)
 *     - fieldsOfStudy (all fields of study in that semester)
 *     - courses (all courses in that semester) (filterable by field of study)
 *         - sections (all sections in that course)
 *
 */
export interface ICourseDataStore {
    semesterData: {
        info: SemesterItem;
        fieldsOfStudy: FieldOfStudyItem[];
        courses: CourseItem[];
    }[];
}

/**
 * A store that is used for caching course data.
 */
export const CourseDataStore = createLocalStore<ICourseDataStore>({ semesterData: [] });

debugStore({ userScheduleStore: CourseDataStore });
