import type { Course } from '@shared/types/Course';

import { useFlattenedCourseSchedule } from './useFlattenedCourseSchedule';

/**
 * Custom hook that retrieves a course from the URL parameters.
 *
 * This hook extracts the `uniqueId` parameter from the URL, finds the corresponding
 * course in the active schedule, and returns it. If the `uniqueId` is not found or
 * does not correspond to any course, it returns `null`. After retrieving the course,
 * it removes the `uniqueId` parameter from the URL.
 *
 * @returns The course corresponding to the `uniqueId` in the URL, or `null` if not found.
 */
export default function useCourseFromUrl(): Course | null {
    const { activeSchedule } = useFlattenedCourseSchedule();

    const getCourseFromUrl = (): Course | null => {
        const urlParams = new URLSearchParams(window.location.search);
        const uniqueIdRaw = urlParams.get('uniqueId');
        if (uniqueIdRaw === null) return null;

        const uniqueId = Number(uniqueIdRaw);
        const course = activeSchedule.courses.find(course => course.uniqueId === uniqueId);
        if (course === undefined) return null;

        urlParams.delete('uniqueId');
        const newUrl = `${window.location.pathname}?${urlParams}`.replace(/\?$/, '');
        window.history.replaceState({}, '', newUrl);

        return course;
    };

    return getCourseFromUrl();
}
