import type { InstructionMode, ScrapedRow, Semester, StatusType } from '@shared/types/Course';
import { Course, Status } from '@shared/types/Course';
import { CourseSchedule } from '@shared/types/CourseSchedule';
import Instructor from '@shared/types/Instructor';
import { getCourseColors } from '@shared/util/colors';
import type { SiteSupportType } from '@views/lib/getSiteSupport';

/**
 * The selectors that we use to scrape the course catalog list table (https://utdirect.utexas.edu/apps/registrar/course_schedule/20239/results/?fos_fl=C+S&level=U&search_type_main=FIELD)
 */
const TableDataSelector = {
    COURSE_HEADER: 'td.course_header',
    UNIQUE_ID: 'td[data-th="Unique"]',
    REGISTER_URL: 'td[data-th="Add"] a',
    INSTRUCTORS: 'td[data-th="Instructor"] span',
    INSTRUCTION_MODE: 'td[data-th="Instruction Mode"]',
    STATUS: 'td[data-th="Status"]',
    SCHEDULE_DAYS: 'td[data-th="Days"]>span',
    SCHEDULE_HOURS: 'td[data-th="Hour"]>span',
    SCHEDULE_LOCATION: 'td[data-th="Room"]>span',
    FLAGS: 'td[data-th="Flags"] ul li',
    CORE_CURRICULUM: 'td[data-th="Core"] ul li',
} as const satisfies Record<string, string>;

/**
 * The selectors that we use to scrape the course details page for an individual course (https://utdirect.utexas.edu/apps/registrar/course_schedule/20239/52700/)
 */
const DetailsSelector = {
    COURSE_NAME: '#details h2',
    COURSE_DESCRIPTION: '#details p',
} as const;

/**
 * A class that allows us to scrape information from UT's course catalog to create our internal representation of a course
 */
export class CourseCatalogScraper {
    support: SiteSupportType;
    doc: Document;
    url: string;

    constructor(support: SiteSupportType, doc: Document = document, url: string = window.location.href) {
        this.support = support;
        this.doc = doc;
        this.url = url;
    }

    /**
     * Pass in a list of HTMLtable rows and scrape every course from them
     * @param rows the rows of the course catalog table
     * @param keepHeaders whether to keep the header rows (which contain the course name) in the output
     * @returns an array of course row objects (which contain courses corresponding to the htmltable row)
     */
    public scrape(rows: NodeListOf<HTMLTableRowElement> | HTMLTableRowElement[], keepHeaders = false): ScrapedRow[] {
        const courses: ScrapedRow[] = [];

        let fullName = this.getFullName();

        rows.forEach(row => {
            if (this.isHeaderRow(row)) {
                fullName = this.getFullName(row);
                if (keepHeaders) {
                    courses.push({
                        element: row,
                        course: null,
                    });
                }
                return;
            }
            // we are now ready to build the course object

            if (!fullName) {
                throw new Error('Course name not found');
            }

            fullName = fullName.replace(/\s\s+/g, ' ').trim();

            const [courseName, department, number] = this.separateCourseName(fullName);
            const [status, isReserved] = this.getStatus(row);

            const newCourse = new Course({
                fullName,
                courseName,
                department,
                number,
                status,
                isReserved,
                creditHours: this.getCreditHours(number),
                schedule: this.getSchedule(row),
                registerURL: this.getRegisterURL(row),
                url: this.getURL(row),
                flags: this.getFlags(row),
                uniqueId: this.getUniqueId(row),
                instructionMode: this.getInstructionMode(row),
                instructors: this.getInstructors(row) as Instructor[],
                description: this.getDescription(this.doc),
                semester: this.getSemester(),
                scrapedAt: Date.now(),
                colors: getCourseColors('emerald', 500),
                core: this.getCore(row),
            });
            courses.push({
                element: row,
                course: newCourse,
            });
        });

        return courses;
    }

    /**
     * Separate the course name into its department, number, and name
     * @example separateCourseName("CS 314H - Honors Discrete Structures") => ["Honors Discrete Structures", "CS", "314H"]
     * @param courseFullName the full name of the course (e.g. "CS 314H - Honors Discrete Structures")
     * @returns an array of the course name , department, and number
     */
    separateCourseName(courseFullName: string): [courseName: string, department: string, number: string] {
        let courseNumberIndex = courseFullName.search(/\d/);
        let department = courseFullName.substring(0, courseNumberIndex).trim();
        let number = courseFullName.substring(courseNumberIndex, courseFullName.indexOf(' ', courseNumberIndex)).trim();
        let courseName = courseFullName.substring(courseFullName.indexOf(' ', courseNumberIndex)).trim();

        return [courseName, department, number];
    }

    /**
     * Gets how many credit hours the course is worth
     * @param courseNumber the course number, CS 314H
     * @return the number of credit hours the course is worth
     */
    getCreditHours(courseNumber: string): number {
        let creditHours = Number(courseNumber.split('')[0]);
        const lastChar = courseNumber.slice(-1);

        // eslint-disable-next-line default-case
        switch (lastChar) {
            case 'A':
            case 'B':
                creditHours /= 2;
                break;
            case 'X':
            case 'Y':
            case 'Z':
                creditHours /= 3;
                break;
        }

        return creditHours;
    }

    /**
     * Scrape the Unique ID from the course catalog table row
     * @param row the row of the course catalog table
     * @returns the uniqueid of the course as a number
     */
    getUniqueId(row: HTMLTableRowElement): number {
        const div = row.querySelector(TableDataSelector.UNIQUE_ID);
        if (!div) {
            throw new Error('Unique ID not found');
        }
        return Number(div.textContent);
    }

    /**
     * Scrapes the individual URL for a given course that takes you to the course details page
     * @param row the row of the course catalog table
     * @returns the url of the course details page for the course in the row
     */
    getURL(row: HTMLTableRowElement): string {
        const div = row.querySelector<HTMLAnchorElement>(`${TableDataSelector.UNIQUE_ID} a`);
        return div?.href || this.url;
    }

    /**
     * Scrape who is teaching the course from the course catalog table row with meta-data about their name
     * @param row the row of the course catalog table
     * @returns an array of instructors for the course
     */
    getInstructors(row: HTMLTableRowElement): Instructor[] {
        const spans = row.querySelectorAll(TableDataSelector.INSTRUCTORS);
        const names = Array.from(spans)
            .map(span => span.textContent || '')
            .map(name => name.trim())
            .filter(Boolean);

        return names.map(fullName => {
            const [lastName, rest = ''] = fullName.split(',').map(s => s.trim());
            const [firstName, middleInitial] = rest.split(' ');

            return new Instructor({
                fullName,
                firstName,
                lastName,
                middleInitial,
            });
        });
    }

    /**
     * Whether or not this is a header row for a course within the course catalog list (we can't scrape courses from header rows)
     * @param row the row of the course catalog table
     * @returns true if this is a header row, false otherwise
     */
    isHeaderRow(row: HTMLTableRowElement): boolean {
        return row.querySelector(TableDataSelector.COURSE_HEADER) !== null;
    }

    /**
     * Scrape whether the class is being taught online, in person, or a hybrid of the two
     * @param row the row of the course catalog table
     * @returns the instruction mode of the course
     */
    getInstructionMode(row: HTMLTableRowElement): InstructionMode {
        const text = (row.querySelector(TableDataSelector.INSTRUCTION_MODE)?.textContent || '').toLowerCase();

        if (text.includes('internet')) {
            return 'Online';
        }
        if (text.includes('hybrid')) {
            return 'Hybrid';
        }
        return 'In Person';
    }

    /**
     * Scrapes the description of the course from the course details page and separates it into an array of cleaned up lines
     * @param doc the document of the course details page to scrape
     * @returns an array of lines of the course description
     */
    getDescription(doc: Document): string[] {
        const lines = doc.querySelectorAll(DetailsSelector.COURSE_DESCRIPTION);
        return Array.from(lines)
            .map(line => line.textContent || '')
            .map(line => line.replace(/\s\s+/g, ' ').trim())
            .filter(Boolean);
    }

    getSemester(): Semester {
        const { pathname } = new URL(this.url);

        const code = pathname.split('/')[4];
        if (!code) {
            throw new Error('Semester not found in URL');
        }

        let year = Number(code.substring(0, 4));
        let seasonCode = Number(code.substring(4, 6));

        if (!year || !seasonCode) {
            throw new Error('Invalid semester found in URL');
        }

        let season: Semester['season'];
        switch (seasonCode) {
            case 2:
                season = 'Spring';
                break;
            case 6:
                season = 'Summer';
                break;
            case 9:
                season = 'Fall';
                break;
            default:
                throw new Error('Invalid season code');
        }

        return {
            year,
            season,
            code,
        };
    }

    /**
     * Get the full name of the course from the course catalog table row (e.g. "CS 314H - Honors Discrete Structures")
     * @param row the row of the course catalog table
     * @returns the full name of the course
     */
    getFullName(row?: HTMLTableRowElement): string {
        if (!row) {
            return this.doc.querySelector(DetailsSelector.COURSE_NAME)?.textContent || '';
        }
        const div = row.querySelector(TableDataSelector.COURSE_HEADER);
        return div?.textContent || '';
    }

    /**
     * When registration is open, the registration URL will show up in the course catalog table row as a link. This will scrape it from the row.
     * @param row the row of the course catalog table
     * @returns the registration URL for the course if it is currently displayed, undefined otherwise
     */
    getRegisterURL(row: HTMLTableRowElement): string | undefined {
        const a = row.querySelector<HTMLAnchorElement>(TableDataSelector.REGISTER_URL);
        return a?.href;
    }

    /**
     * Scrapes whether the course is open, closed, waitlisted, or cancelled
     * @param row the row of the course catalog table
     * @returns
     */
    getStatus(row: HTMLTableRowElement): [status: StatusType, isReserved: boolean] {
        const div = row.querySelector(TableDataSelector.STATUS);
        if (!div) {
            throw new Error('Status not found');
        }
        const text = (div.textContent || '').trim().toLowerCase();
        if (!text) {
            throw new Error('Status not found');
        }
        const isReserved = text.includes('reserved');

        if (text.includes('open')) {
            return [Status.OPEN, isReserved];
        }
        if (text.includes('closed')) {
            return [Status.CLOSED, isReserved];
        }
        if (text.includes('waitlisted')) {
            return [Status.WAITLISTED, isReserved];
        }
        if (text.includes('cancelled')) {
            return [Status.CANCELLED, isReserved];
        }
        throw new Error(`Unknown status: ${text}`);
    }

    /**
     * At UT, some courses have certain "flags" which aid in graduation. This will scrape the flags from the course catalog table row.
     * @param row
     * @returns an array of flags for the course
     */
    getFlags(row: HTMLTableRowElement): string[] {
        const lis = row.querySelectorAll(TableDataSelector.FLAGS);
        return Array.from(lis).map(li => li.textContent || '');
    }

    /**
     * Get the list of core curriculum requirements the course satisfies
     * @param row
     * @returns an array of core curriculum codes
     */
    getCore(row: HTMLTableRowElement): string[] {
        const lis = row.querySelectorAll(TableDataSelector.CORE_CURRICULUM);
        return (
            Array.from(lis)
                // ut schedule is weird and puts a blank core curriculum element even if there aren't any core requirements so filter those out
                .filter(li => li.getAttribute('title') !== ' core curriculum requirement')
                .map(li => li.textContent || '')
        );
    }

    /**
     * This will scrape all the time information from the course catalog table row and return it as a CourseSchedule object, which represents all of the meeting timiestimes/places of the course.
     * @param row the row of the course catalog table
     * @returns a CourseSchedule object representing all of the meetings of the course
     */
    getSchedule(row: HTMLTableRowElement): CourseSchedule {
        const dayLines = row.querySelectorAll(TableDataSelector.SCHEDULE_DAYS);
        const hourLines = row.querySelectorAll(TableDataSelector.SCHEDULE_HOURS);
        const locLines = row.querySelectorAll(TableDataSelector.SCHEDULE_LOCATION);

        if (dayLines.length !== hourLines.length) {
            throw new Error('Schedule data is malformed');
        }

        const schedule = new CourseSchedule();

        for (let i = 0; i < dayLines.length; i += 1) {
            const dayText = dayLines[i]?.textContent || '';
            const hourText = hourLines[i]?.textContent || '';
            const locationText = locLines[i]?.textContent || '';

            schedule.meetings.push(CourseSchedule.parse(dayText, hourText, locationText));
        }

        return schedule;
    }
}
