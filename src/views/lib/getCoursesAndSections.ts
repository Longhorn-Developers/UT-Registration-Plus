import { CourseDataStore } from '@shared/storage/courseDataStore';
import type { ScrapedRow } from '@shared/types/Course';
import type { CourseNumberItem, FieldOfStudyItem, SectionItem, SemesterItem } from '@shared/types/CourseData';
import { generateSemesters } from '@shared/util/generateSemesters';
import { capitalize } from '@shared/util/string';

import { FIELDS_OF_STUDY } from '../resources/studyFields';
import { CourseCatalogScraper } from './CourseCatalogScraper';
import { SiteSupport } from './getSiteSupport';

/**
 * Fetches study fields from the API (fake implementation)
 */
async function fetchFieldsOfStudy(_semester: SemesterItem): Promise<FieldOfStudyItem[]> {
    // console.log('Fetched fields of study [Fake]', FIELDS_OF_STUDY);
    return FIELDS_OF_STUDY as FieldOfStudyItem[];
}

/**
 * Fetches course numbers from the API
 */
async function fetchCourseNumbers(semester: SemesterItem, studyFieldId: string): Promise<CourseNumberItem[]> {
    const formattedSemester = `${semester.year}%20${semester.season}`;
    const formattedStudyFieldId = studyFieldId.replace(' ', '%20');
    const url = `https://utexas.collegescheduler.com/api/terms/${formattedSemester}/subjects/${formattedStudyFieldId}/courses`;

    const data = await fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching course numbers:', error);
            return [];
        });

    // console.log('Fetched course numbers:', data);

    const processedData = data.map((item: { id: string; subjectId: string; displayTitle: string }) => ({
        id: item.id.replace('|', ' '),
        label: `${item.subjectId} ${item.displayTitle}`,
    }));

    return processedData;
}

/**
 * Fetches sections from the API (fake implementation)
 */
async function fetchSections(
    semester: SemesterItem,
    fieldOfStudy: FieldOfStudyItem,
    courseNumber: CourseNumberItem
): Promise<SectionItem[]> {
    const formattedDepartment = fieldOfStudy.id.replace(' ', '+');
    const formattedCourseNumber = courseNumber.id.split(' ').pop();
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

    // console.log('Fetched sections:', data);

    if (!data) {
        return [];
    }

    const courseCatalogScraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, data, url);
    const rows = courseCatalogScraper.scrape(data.querySelectorAll('table.results tbody tr'));

    const processRow = ({ course }: ScrapedRow) => {
        if (!course) {
            return { id: '', label: '' };
        }
        const { uniqueId } = course;
        const instructor = capitalize(
            course.instructors
                .map(instr => instr.fullName)
                .filter(instr => instr)
                .join(', ')
        );

        const time = course.schedule.meetings
            .map(meeting => {
                const days = meeting.getDaysString({ format: 'short' });
                const time = meeting.getTimeString({ separator: '-' });
                const building = meeting.location?.building;
                const room = meeting.location?.room;
                return `${days} ${time}, ${building} ${room}`;
            })
            .join('\n');

        return {
            id: `${uniqueId}`,
            label: `${uniqueId} with ${instructor} ${time}`,
        };
    };

    // console.log('Scraped rows:', rows);
    // console.log(rows);
    // console.log(data);
    return rows.filter((row: ScrapedRow) => row.course !== null).map(processRow);
}

/**
 * A service that handles fetching and caching course data from UT.
 *
 * This service interacts with a local store to cache data and avoid unnecessary API calls.
 * It provides methods to retrieve the "Fields of Study", "course numbers", and sections for a given semester.
 */
export class CourseDataService {
    /**
     * Retrieves semesters from the local store
     */
    getSemesters(): SemesterItem[] {
        return generateSemesters({ year: 2025, season: 'Spring' }, { year: 2025, season: 'Fall' });
    }

    /**
     * Retrieves study fields for a specific semester
     */
    async getFieldsOfStudy(semester: SemesterItem): Promise<FieldOfStudyItem[]> {
        const data = await CourseDataStore.get('courseData');

        data[semester.id] = data[semester.id] || { info: semester, studyFields: {} };

        if (!data[semester.id]!.studyFields || Object.keys(data[semester.id]!.studyFields).length === 0) {
            const fieldsOfStudy = await fetchFieldsOfStudy(semester);
            fieldsOfStudy.forEach(field => {
                data[semester.id]!.studyFields[field.id] = { info: field, courseNumbers: {} };
            });

            console.log('Setting course data:', data);
            await CourseDataStore.set('courseData', data);
        }

        return Object.values(data[semester.id]!.studyFields).map(field => field.info);
    }

    /**
     * Retrieves course numbers for a specific study field
     */
    async getCourseNumbers(semester: SemesterItem, fieldOfStudy: FieldOfStudyItem): Promise<CourseNumberItem[]> {
        const data = await CourseDataStore.get('courseData');

        data[semester.id] = data[semester.id] || { info: semester, studyFields: {} };
        data[semester.id]!.studyFields[fieldOfStudy.id] = data[semester.id]!.studyFields[fieldOfStudy.id] || {
            info: fieldOfStudy,
            courseNumbers: {},
        };

        if (
            !data[semester.id]!.studyFields[fieldOfStudy.id]!.courseNumbers ||
            Object.keys(data[semester.id]!.studyFields[fieldOfStudy.id]!.courseNumbers).length === 0
        ) {
            const courseNumbers = await fetchCourseNumbers(semester, fieldOfStudy.id);
            courseNumbers.forEach(courseNumber => {
                data[semester.id]!.studyFields[fieldOfStudy.id]!.courseNumbers[courseNumber.id] = {
                    info: courseNumber,
                    sections: {},
                };
            });

            await CourseDataStore.set('courseData', data);
        }

        return Object.values(data[semester.id]!.studyFields[fieldOfStudy.id]!.courseNumbers).map(course => course.info);
    }

    /**
     * Retrieves sections for a specific course number
     */
    async getSections(
        semester: SemesterItem,
        studyField: FieldOfStudyItem,
        courseNumber: CourseNumberItem
    ): Promise<SectionItem[]> {
        const data = await CourseDataStore.get('courseData');

        data[semester.id] = data[semester.id] || { info: semester, studyFields: {} };
        data[semester.id]!.studyFields[studyField.id] = data[semester.id]!.studyFields[studyField.id] || {
            info: studyField,
            courseNumbers: {},
        };
        data[semester.id]!.studyFields[studyField.id]!.courseNumbers[courseNumber.id] = data[semester.id]!.studyFields[
            studyField.id
        ]!.courseNumbers[courseNumber.id] || {
            info: courseNumber,
            sections: {},
        };

        if (
            !data[semester.id]!.studyFields[studyField.id]!.courseNumbers[courseNumber.id]!.sections ||
            Object.keys(data[semester.id]!.studyFields[studyField.id]!.courseNumbers[courseNumber.id]!.sections)
                .length === 0
        ) {
            const sections = await fetchSections(semester, studyField, courseNumber);
            sections.forEach(section => {
                data[semester.id]!.studyFields[studyField.id]!.courseNumbers[courseNumber.id]!.sections[section.id] =
                    section;
            });

            await CourseDataStore.set('courseData', data);
        }

        return Object.values(data[semester.id]!.studyFields[studyField.id]!.courseNumbers[courseNumber.id]!.sections);
    }
}
