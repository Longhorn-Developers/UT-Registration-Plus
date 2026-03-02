import type { CourseItem, SemesterItem } from '@shared/types/CourseData';

/**
 * Represents a collection of course catalog messages.
 */
export interface CourseCatalogMessages {
    /**
     * Fetch all the available semesters.
     *
     * @returns The semesters as a JSON string
     */
    fetchAvailableSemesters: () => string;

    /**
     * Fetch all the fields of study for a given semester.
     *
     * @param data - The semester to fetch fields of study for
     *
     * @returns The fields of study as a JSON string
     */
    fetchAllFieldsOfStudy: (data: { semester: SemesterItem }) => string;

    /**
     * Fetch all the courses for a given semester.
     *
     * @param data - The semester to fetch courses for
     * @returns The courses as a JSON string
     */
    fetchAllCourses: (data: { semester: SemesterItem }) => string;

    /**
     * Fetch the sections data for a given course
     *
     * @param data - The course to fetch sections for
     * @returns The sections for that course as a JSON string
     */
    fetchSections: (data: { semester: SemesterItem; course: CourseItem }) => string;
}
