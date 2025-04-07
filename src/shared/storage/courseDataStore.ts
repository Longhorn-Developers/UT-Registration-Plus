import type { CourseNumberItem, FieldOfStudyItem, SectionItem, SemesterItem } from '@shared/types/CourseData';
import { createLocalStore, debugStore } from 'chrome-extension-toolkit';

/**
 * An interface that represents the course data store of the fields of study,
 * course numbers, and sections for each semester.
 *
 * The structure is as follows:
 * - semester.id
 *   - info (the semester details)
 *   - field of study.id
 *      - info (the field of study details)
 *      - course number.id
 *          - info (the course number details)
 *          - section (the section details)
 *
 */
export interface ICourseDataStore {
    courseData: Record<
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
}

/**
 * A store that is used for storing user schedules (and the active schedule)
 */
export const CourseDataStore = createLocalStore<ICourseDataStore>({ courseData: {} });

debugStore({ userScheduleStore: CourseDataStore });
