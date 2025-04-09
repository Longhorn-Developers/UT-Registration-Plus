import { CourseDataStore } from '@shared/storage/courseDataStore';
import type { ScrapedRow } from '@shared/types/Course';
import type { CourseItem, SectionItem, SemesterItem } from '@shared/types/CourseData';
import { capitalize } from '@shared/util/string';

import { CourseCatalogScraper } from './CourseCatalogScraper';
import { SiteSupport } from './getSiteSupport';

/**
 * Fetches course numbers from the UT Planner API.
 *
 * @param semester - The semester for which to fetch course numbers.
 * @param studyFieldId - The ID of the study field.
 *
 * @returns A promise that resolves to an array of course numbers.
 */
async function fetchCourseNumbers(semester: SemesterItem, fieldOfStudyId: string): Promise<CourseItem[]> {
    const formattedSemester = `${semester.year}%20${semester.season}`;
    const formattedStudyFieldId = fieldOfStudyId.replace(' ', '%20');
    const url = `https://utexas.collegescheduler.com/api/terms/${formattedSemester}/subjects/${formattedStudyFieldId}/courses`;

    const data = await fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching course numbers:', error);
            return [];
        });

    const processedData = data.map((item: { id: string; subjectId: string; displayTitle: string }) => ({
        id: item.id.replace('|', ' '),
        fieldOfStudyId,
        courseNumber: item.id.split('|')[1] || '',
        courseName: item.displayTitle,
        label: `${item.subjectId} ${item.displayTitle}`,
    }));

    return processedData;
}

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
async function fetchSections(semester: SemesterItem, course: CourseItem): Promise<SectionItem[]> {
    const formattedDepartment = course.fieldOfStudyId.replace(' ', '+');
    const formattedCourseNumber = course.id.split(' ').pop();
    const url =
        `https://utdirect.utexas.edu/apps/registrar/` +
        `course_schedule/${semester.id}/results/?search_type_main=COURSE&` +
        `fos_cn=${formattedDepartment}` +
        `&course_number=${formattedCourseNumber}`;

    const data = await fetch(url)
        .then(response => response.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html'))
        .catch(error => {
            console.error('Error fetching sections:', error);
        });

    if (!data) {
        return [];
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
            crs.courseName?.trim().toLowerCase() !== course.courseName?.trim().toLowerCase()
                ? ` (${capitalize(crs.courseName)})`
                : '';

        console.log('crs vs course names', crs.courseName, course.courseName);

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

    return rows.filter((row: ScrapedRow) => row.course !== null).map(processRow) as SectionItem[];
}

/**
 * A service that handles fetching and caching course data from UT.
 *
 * This service interacts with a local store to cache data and avoid unnecessary API calls.
 * It provides methods to retrieve the courses & sections info for a given semester.
 */
export class CourseDataService {
    /**
     * Retrieves course numbers for a specific study field
     */
    static async getCourseNumbers(semester: SemesterItem, fieldOfStudyId: string) {
        const data = await CourseDataStore.get('courseData');

        data[semester.id] = data[semester.id] || { info: semester, courses: [], sections: [] };

        const curCourses = data[semester.id]!.courses.filter(
            (course: CourseItem) => course.fieldOfStudyId === fieldOfStudyId
        );

        if (curCourses.length === 0) {
            const newCourses = await fetchCourseNumbers(semester, fieldOfStudyId);
            newCourses.forEach(course => {
                data[semester.id]!.courses.push(course);
            });
            await CourseDataStore.set('courseData', data);
        }
    }

    /**
     * Retrieves sections for a specific course number
     */
    static async getSections(semester: SemesterItem, courseNumber: CourseItem) {
        const data = await CourseDataStore.get('courseData');

        data[semester.id] = data[semester.id] || { info: semester, courses: [], sections: [] };
        const curSections = data[semester.id]!.sections.filter(
            (section: SectionItem) =>
                section.fieldOfStudyId === courseNumber.fieldOfStudyId &&
                section.courseNumber === courseNumber.courseNumber
        );

        if (curSections.length === 0) {
            const newSections = await fetchSections(semester, courseNumber);
            newSections.forEach(section => {
                data[semester.id]!.sections.push(section);
            });
            await CourseDataStore.set('courseData', data);
        }
    }
}
