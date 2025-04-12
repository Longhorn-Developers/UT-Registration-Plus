import type { CourseItem, SemesterItem } from '@shared/types/CourseData';

/**
 * Represents a collection of course catalog messages.
 */
export interface CourseCatalogMessages {
    /**
     * Fetch the courses data for a given semester & major.
     *
     * @param data - The semester and fieldOfStudy id to fetch courses for
     * @returns The courses as a JSON string
     */
    fetchCourses: (data: { semester: SemesterItem; fieldOfStudyId: string }) => Promise<string>;

    /**
     * Fetch the sections data for a given course
     *
     * @param data - The course to fetch sections for
     * @returns The sections for that course as a JSON string
     */
    fetchSections: (data: { semester: SemesterItem; course: CourseItem }) => Promise<string>;
}
