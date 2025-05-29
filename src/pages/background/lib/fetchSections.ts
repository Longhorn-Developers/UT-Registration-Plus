import type { ScrapedRow } from '@shared/types/Course';
import type { CourseItem, SectionItem, SemesterItem } from '@shared/types/CourseData';
import { capitalize } from '@shared/util/string';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import { SiteSupport } from '@views/lib/getSiteSupport';

/**
 * Scrapes the sections data from the UT Course Catalog page.
 *
 * It fetches the HTML content of the course catalog page for a specific
 * semester and course number, and uses the CourseCatalogScraper to extract the
 * relevant data.
 *
 * @param semester - The semester for which to fetch sections.
 * @param fieldOfStudy - The field of study for the course.
 *
 * @returns A promise that resolves to an array of sections.
 */
export default async function fetchSections(semester: SemesterItem, course: CourseItem): Promise<string> {
    const formattedDepartment = course.fieldOfStudyId.replace(' ', '+');
    const formattedCourseNumber = course.id.split(' ').pop();
    const url =
        `https://utdirect.utexas.edu/apps/registrar/` +
        `course_schedule/${semester.code}/results/?search_type_main=COURSE&` +
        `fos_cn=${formattedDepartment}` +
        `&course_number=${formattedCourseNumber}`;

    const data = await fetch(url)
        .then(response => response.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html'))
        .catch(error => {
            console.error('Error fetching sections:', error);
            throw error;
        });

    if (!data) {
        throw new Error('No data returned from fetch');
    }

    const courseCatalogScraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, data, url);
    const rows = courseCatalogScraper.scrape(data.querySelectorAll('table.results tbody tr'));

    const processRow = (row: ScrapedRow) => {
        const { course: crs } = row;
        if (!crs) {
            return { id: '', label: '' };
        }

        const { uniqueId } = crs;
        const instructors = crs.instructors
            .map(instr => instr.fullName)
            .filter(instr => instr !== undefined && instr !== null)
            .map(capitalize);

        const time = crs.schedule.meetings
            .map(meeting => {
                const days = meeting.getDaysString({ format: 'short' });
                const time = meeting.getTimeString({ separator: '-' });
                const building = meeting.location?.building;
                const room = meeting.location?.room;
                return `${days} ${time}, ${building} ${room}`;
            })
            .join('\n');

        const instructorsLabel = instructors.length > 0 ? ` with ${instructors.join(', ')}` : '';

        const topicLabel =
            crs.fullName?.trim().toLowerCase() !== course.label.trim().toLowerCase()
                ? ` (${capitalize(crs.courseName)})`
                : '';

        return {
            id: `${uniqueId}`,
            fieldOfStudyId: course.fieldOfStudyId,
            courseNumber: course.courseNumber,
            courseName: crs.courseName,
            instructors,
            label: `${uniqueId}${topicLabel}${instructorsLabel} ${time}`,
        };
    };

    console.log('Scraped rows:', rows);

    return JSON.stringify(rows.filter((row: ScrapedRow) => row.course !== null).map(processRow) as SectionItem[]);
}
