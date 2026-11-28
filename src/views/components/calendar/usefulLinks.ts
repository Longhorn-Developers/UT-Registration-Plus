import { getRecentSemesters } from '@shared/types/Course';

export interface LinkItem {
    text: string;
    url: string;
}

/** Month (0-indexed) from which the academic calendar link rolls over to the next academic year (August) */
const ACADEMIC_YEAR_START_MONTH = 7;

const twoDigitYear = (year: number): string => String(year % 100).padStart(2, '0');

/**
 * Builds the "useful links" for the given date, so the course schedule and academic calendar links stay current.
 *
 * @param date - The date to build the links for
 * @returns The useful links, starting with the current registration term and the 3 terms before it
 */
export function getUsefulLinks(date: Date): LinkItem[] {
    const courseScheduleLinks = getRecentSemesters(date).map(({ year, season, code }) => ({
        text: `${season} '${twoDigitYear(year)} Course Schedule`,
        url: `https://utdirect.utexas.edu/apps/registrar/course_schedule/${code}/`,
    }));

    const academicYearStart =
        date.getMonth() >= ACADEMIC_YEAR_START_MONTH ? date.getFullYear() : date.getFullYear() - 1;
    const startYY = twoDigitYear(academicYearStart);
    const endYY = twoDigitYear(academicYearStart + 1);

    return [
        // {
        //     text: 'Course Schedule Archives',
        //     url: 'https://registrar.utexas.edu/schedules/archive',
        // },
        ...courseScheduleLinks,
        {
            text: 'Other Course Schedules',
            url: 'https://registrar.utexas.edu/schedules',
        },
        {
            text: 'My Degree Audit (IDA)',
            url: 'https://utdirect.utexas.edu/apps/degree/audits/',
        },
        {
            text: `'${startYY}–'${endYY} Academic Calendar`,
            url: `https://registrar.utexas.edu/calendars/${startYY}-${endYY}`,
        },
        {
            text: 'Registration Info Sheet (RIS)',
            url: 'https://utdirect.utexas.edu/registrar/ris.WBX',
        },
        {
            text: 'Register for Courses',
            url: 'https://utdirect.utexas.edu/registration/chooseSemester.WBX',
        },
    ];
}

/**
 * The single source of truth for the "useful links" shown in both the calendar and UT map views.
 */
export const USEFUL_LINKS: LinkItem[] = getUsefulLinks(new Date());
