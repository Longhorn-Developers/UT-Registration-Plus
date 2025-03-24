import { CourseDataStore } from '@shared/storage/courseDataStore';
import type { ScrapedRow } from '@shared/types/Course';
import type { CourseNumberItem, FieldOfStudyItem, SectionItem, SemesterItem } from '@shared/types/CourseData';

import { FIELDS_OF_STUDY } from '../resources/studyFields';
import { CourseCatalogScraper } from './CourseCatalogScraper';
import { SiteSupport } from './getSiteSupport';

/**
 * A service that handles fetching and caching course data from UT.
 *
 * This service interacts with a local store to cache data and avoid unnecessary API calls.
 * It provides methods to retrieve the "Fields of Study", "course numbers", and sections for a given semester.
 */
export class CourseDataService {
    /**
     * Retrieves study fields for a specific semester
     */
    async getFieldOfStudy(semester: SemesterItem): Promise<FieldOfStudyItem[]> {
        let semesterData = await CourseDataStore.get(semester.id);

        // Cache hit
        if (semesterData.studyFields) {
            return Object.values(semesterData.studyFields).map(field => field.info);
        }

        // Fetch and process if not in cache
        const studyFields = await this.fetchFieldsOfStudy(semester);

        // Update the store with the new study fields
        if (!semesterData) {
            semesterData = { info: semester, studyFields: {} };
        }

        // Add each study field to the store
        for (const field of studyFields) {
            semesterData.studyFields[field.id] = {
                info: field,
                courseNumbers: {},
            };
        }

        await CourseDataStore.set(semester.id, semesterData);
        return studyFields;
    }

    /**
     * Retrieves course numbers for a specific study field
     */
    async getCourseNumbers(semester: SemesterItem, fieldOfStudy: FieldOfStudyItem): Promise<CourseNumberItem[]> {
        let semesterData = await CourseDataStore.get(semester.id);
        let fieldOfStudyData = semesterData.studyFields[fieldOfStudy.id];

        if (fieldOfStudyData) {
            const courseNumbers = Object.values(fieldOfStudyData.courseNumbers).map(course => course.info);

            // Cache hit
            if (courseNumbers.length > 0) {
                return courseNumbers;
            }
        }

        // Fetch and process if not in cache
        const courseNumbers = await this.fetchCourseNumbers(semester, fieldOfStudy.id);

        if (!semesterData) {
            semesterData = { info: semester, studyFields: {} };
        }

        if (!fieldOfStudyData) {
            fieldOfStudyData = {
                info: fieldOfStudy,
                courseNumbers: {},
            };
        }

        if (!fieldOfStudyData.courseNumbers) {
            fieldOfStudyData.courseNumbers = {};
        }

        for (const course of courseNumbers) {
            fieldOfStudyData.courseNumbers[course.id] = {
                info: course,
                sections: {},
            };
        }

        semesterData.studyFields[fieldOfStudy.id] = fieldOfStudyData;
        await CourseDataStore.set(semester.id, semesterData);
        return courseNumbers;
    }

    /**
     * Retrieves sections for a specific course number
     */
    async getSections(
        semester: SemesterItem,
        studyField: FieldOfStudyItem,
        courseNumber: CourseNumberItem
    ): Promise<SectionItem[]> {
        let semesterData = await CourseDataStore.get(semester.id);
        let fieldOfStudyData = semesterData.studyFields[studyField.id];
        let courseNumberData = fieldOfStudyData?.courseNumbers[courseNumber.id];

        // Check if data is in cache
        if (!courseNumberData) {
            throw new Error(
                `Course number ${courseNumber.id} not found for study field ${studyField.id} in semester ${semester.id}`
            );
        }

        if (courseNumberData && Object.keys(courseNumberData.sections).length > 0) {
            return Object.values(courseNumberData.sections);
        }

        // Fetch and process if not in cache
        const sections = await this.fetchSections(semester, studyField, courseNumber);

        if (!semesterData) {
            semesterData = { info: semester, studyFields: {} };
        }

        if (!fieldOfStudyData) {
            fieldOfStudyData = {
                info: studyField,
                courseNumbers: {},
            };
        }

        if (!courseNumberData) {
            courseNumberData = {
                info: courseNumber,
                sections: {},
            };
        }

        if (!courseNumberData.sections) {
            courseNumberData.sections = {};
        }

        for (const section of sections) {
            courseNumberData.sections[section.id] = section;
        }

        fieldOfStudyData.courseNumbers[courseNumber.id] = courseNumberData;
        semesterData.studyFields[studyField.id] = fieldOfStudyData;
        await CourseDataStore.set(semester.id, semesterData);
        return sections;
    }

    /**
     * Fetches study fields from the API (fake implementation)
     */
    private async fetchFieldsOfStudy(_semester: SemesterItem): Promise<FieldOfStudyItem[]> {
        return FIELDS_OF_STUDY;
    }

    /**
     * Fetches course numbers from the API (fake implementation)
     */
    private async fetchCourseNumbers(semester: SemesterItem, studyFieldId: string): Promise<CourseNumberItem[]> {
        const formattedSemester = `${semester.year}%20${semester.season}`;
        const formattedStudyFieldId = studyFieldId.replace(' ', '%20');
        const url = `https://utexas.collegescheduler.com/api/terms/${formattedSemester}/subjects/${formattedStudyFieldId}/courses`;

        const data = await fetch(url)
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching course numbers:', error);
                return [];
            });

        const processedData = data.map((item: { id: string; subjectId: string; displayTitle: string }) => ({
            id: item.id.replace('|', ' '),
            label: `${item.subjectId} ${item.displayTitle}`,
        }));

        return processedData;
    }

    /**
     * Fetches sections from the API (fake implementation)
     */
    private async fetchSections(
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

        if (!data) {
            return [];
        }

        const courseCatalogScraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, data, url);
        const rows = courseCatalogScraper.scrape(data.querySelectorAll('#inner_body > table > tbody'));
        return rows
            .filter((row: ScrapedRow) => row.course !== null)
            .map(
                (row: ScrapedRow) =>
                    ({
                        id: row.course?.uniqueId ?? '',
                        label: row.course?.fullName ?? '',
                    }) as SectionItem
            );
    }
}
