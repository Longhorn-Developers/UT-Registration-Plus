import type { Serialized } from '@chrome-extension-toolkit';
import type { Course } from '@shared/types/Course';
import type { CourseColors, TWColorway, TWIndex } from '@shared/types/ThemeColors';
import type { UserSchedule } from '@shared/types/UserSchedule';

import { getColorwayFromColor, getCourseColors, useableColorways } from './base';

/**
 * Get next unused color in a tailwind colorway for a given schedule
 *
 * @param schedule - The schedule which the course is in
 * @param course - The course to get the color for
 * @param index - The index of the primary color in the colorway
 * @param offset - The offset to get the secondary color
 * @returns The primary and secondary colors
 */
export function getUnusedColor(
    schedule: Serialized<UserSchedule>,
    course: Course,
    index?: number,
    offset?: number
): CourseColors {
    // strategy: First, check if any of the course's in schedule have the same department as the current course,
    // if so, use a colorway near the color of that course if possible.
    // Otherwise, find a colorway that is not used in the schedule and at least two hues away from any other color in the schedule.

    // wrapping helper functions
    function getPreviousColorway(colorway: TWColorway): TWColorway {
        const colorwayIndex = useableColorways.indexOf(colorway);
        return useableColorways[(colorwayIndex - 1 + useableColorways.length) % useableColorways.length] as TWColorway;
    }

    function getNextColorway(colorway: TWColorway): TWColorway {
        const colorwayIndex = useableColorways.indexOf(colorway);
        return useableColorways[(colorwayIndex + 1) % useableColorways.length] as TWColorway;
    }

    const scheduleCourses = schedule.courses.map(c => ({
        ...c,
        theme: (() => {
            try {
                return getColorwayFromColor(c.colors.primaryColor);
            } catch (_error) {
                // Default to emerald colorway with index 500
                return {
                    colorway: 'emerald' as TWColorway,
                    index: 500 as TWIndex,
                };
            }
        })(),
    }));

    const usedColorways = new Set(scheduleCourses.map(c => c.theme.colorway));
    const availableColorways = new Set(useableColorways.filter(c => !usedColorways.has(c)));

    if (availableColorways.size > 0) {
        const sameDepartment = scheduleCourses.filter(c => c.department === course.department);

        sameDepartment.sort((a, b) => {
            const aIndex = useableColorways.indexOf(a.theme.colorway);
            const bIndex = useableColorways.indexOf(b.theme.colorway);

            return aIndex - bIndex;
        });

        if (sameDepartment.length > 0) {
            // check to see if any adjacent colorways are available
            // biome-ignore lint/style/noNonNullAssertion: guaranteed non-empty array above, so a random index is valid
            const centerCourse = sameDepartment[Math.floor(Math.random() * sameDepartment.length)]!;

            let nextColorway = getNextColorway(centerCourse.theme.colorway);
            let prevColorway = getPreviousColorway(centerCourse.theme.colorway);

            while (true) {
                if (availableColorways.has(nextColorway)) {
                    return getCourseColors(nextColorway, index, offset);
                }
                if (availableColorways.has(prevColorway)) {
                    return getCourseColors(prevColorway, index, offset);
                }

                nextColorway = getNextColorway(nextColorway);
                prevColorway = getPreviousColorway(prevColorway);
            }
        }

        const shortenedColorways = new Set(availableColorways);
        // no courses in the same department, restrict colorways to those which are at least 2 indexes away from any used colors
        for (const colorway of usedColorways) {
            shortenedColorways.delete(getPreviousColorway(colorway));
            shortenedColorways.delete(getNextColorway(colorway));
        }

        if (shortenedColorways.size > 0) {
            // TODO: make this go by 3's to leave future spaces open
            // biome-ignore lint/style/noNonNullAssertion: guaranteed non-empty array above, so a random index is valid
            const randomColorway = Array.from(shortenedColorways)[Math.floor(Math.random() * shortenedColorways.size)]!;

            return getCourseColors(randomColorway, index, offset);
        }
        // no colorways are at least 2 indexes away from any used colors, just get a random colorway
        const randomColorway: TWColorway | undefined =
            Array.from(availableColorways)[Math.floor(Math.random() * availableColorways.size)];

        if (!randomColorway) {
            throw new Error('randomColorway is undefined');
        }

        return getCourseColors(randomColorway, index, offset);
    }
    // TODO: get just a random color idk
    return getCourseColors('emerald', index, offset);
}
