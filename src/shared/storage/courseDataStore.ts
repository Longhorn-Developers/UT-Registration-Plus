import { createLocalStore, debugStore } from 'chrome-extension-toolkit';

import type { CourseNumberItem, FieldOfStudyItem, SectionItem, SemesterItem } from '../types/CourseData';

/**
 * A type that represents the course data store of the fields of study,
 * course numbers, and sections for each semester.
 *
 * The structure is as follows:
 * - semester
 *   - info (the semester details)
 *   - field of study
 *      - info (the field of study details)
 *      - course number
 *          - info (the course number details)
 *          - section
 *
 */
export type ICourseDataStore = Record<
    string,
    {
        info: SemesterItem;
        studyFields: Record<
            string,
            {
                info: FieldOfStudyItem;
                courseNumbers: Record<
                    string,
                    {
                        info: CourseNumberItem;
                        sections: Record<string, SectionItem>;
                    }
                >;
            }
        >;
    }
>;

/**
 * A store that is used for storing user schedules (and the active schedule)
 */
export const CourseDataStore = createLocalStore<ICourseDataStore>({});

debugStore({ userScheduleStore: CourseDataStore });
