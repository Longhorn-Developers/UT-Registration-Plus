import type { Course } from '@shared/types/Course';

/**
 * Builds the UT course schedule search URL that lists every section of a course in its semester.
 *
 * @param course - the course to find all sections of
 * @returns the search results URL for the course
 */
export function getCourseSectionsUrl(course: Pick<Course, 'url' | 'department' | 'number'>): string {
    const url = new URL(course.url);

    // Swap the last path segment (the unique number, or `results`) for `results`
    url.pathname = url.pathname.replace(/[^/]+\/?$/, 'results/');
    url.search = new URLSearchParams({
        search_type_main: 'COURSE',
        fos_cn: course.department,
        course_number: course.number,
    }).toString();

    return url.toString();
}
