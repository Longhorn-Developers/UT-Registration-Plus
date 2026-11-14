import type { Course } from '@shared/types/Course';

const SEMESTER_CODE_IN_PATH = /\/course_schedule\/(\d{5})(?:\/|$)/;

/**
 * Builds the UT course schedule search URL that lists every section of a course in its semester.
 *
 * @example
 * ```
 * // C S 314 with url https://utdirect.utexas.edu/apps/registrar/course_schedule/20269/54975/
 * getCourseSectionsUrl(course);
 * // => https://utdirect.utexas.edu/apps/registrar/course_schedule/20269/results/?search_type_main=COURSE&fos_cn=C+S&course_number=314
 * ```
 * @param course - the course to find all sections of
 * @returns the search results URL, or the course's own URL if its semester can't be determined
 */
export function getCourseSectionsUrl(course: Pick<Course, 'url' | 'department' | 'number' | 'semester'>): string {
    let url: URL;
    try {
        url = new URL(course.url);
    } catch {
        return course.url;
    }

    const semesterCode = course.semester?.code ?? url.pathname.match(SEMESTER_CODE_IN_PATH)?.[1];
    if (!semesterCode) {
        return course.url;
    }

    url.pathname = `/apps/registrar/course_schedule/${semesterCode}/results/`;
    url.search = new URLSearchParams({
        search_type_main: 'COURSE',
        fos_cn: course.department,
        course_number: course.number,
    }).toString();
    url.hash = '';

    return url.toString();
}
