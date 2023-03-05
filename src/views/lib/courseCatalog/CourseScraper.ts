import { Course, Instructor, Status, InstructionMode, CourseRow } from 'src/shared/types/Course';
import { CourseSchedule, CourseSection } from 'src/shared/types/CourseSchedule';
import { SiteSupport } from 'src/views/lib/getSiteSupport';

enum TableDataSelector {
    COURSE_HEADER = 'td.course_header',
    UNIQUE_ID = 'td[data-th="Unique"]',
    REGISTER_URL = 'td[data-th="Add"] a',
    INSTRUCTORS = 'td[data-th="Instructor"] span',
    INSTRUCTION_MODE = 'td[data-th="Instruction Mode"]',
    STATUS = 'td[data-th="Status"]',
    SCHEDULE_DAYS = 'td[data-th="Days"]>span',
    SCHEDULE_HOURS = 'td[data-th="Hour"]>span',
    SCHEDULE_ROOM = 'td[data-th="Room"]>span',
    FLAGS = 'td[data-th="Flags"] ul li',
}

enum DetailsSelector {
    COURSE_NAME = '#details h2',
    COURSE_DESCRIPTION = '#details p',
}

export class CourseScraper {
    support: SiteSupport;

    constructor(support: SiteSupport) {
        this.support = support;
    }

    public scrape(rows: NodeListOf<HTMLTableRowElement>): CourseRow[] {
        const courses: CourseRow[] = [];

        let fullName = this.getFullName();

        rows.forEach(row => {
            if (this.isHeaderRow(row)) {
                fullName = this.getFullName(row);
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
                schedule: this.getSchedule(row),
                registerURL: this.getRegisterURL(row),
                url: this.getURL(row),
                flags: this.getFlags(row),
                uniqueId: this.getUniqueId(row),
                instructionMode: this.getInstructionMode(row),
                instructors: this.getInstructors(row),
                description: this.getDescription(document),
            });
            courses.push({
                rowElement: row,
                course: newCourse,
            });
        });

        return courses;
    }

    separateCourseName(name: string): [courseName: string, department: string, number: string] {
        let courseNumberIndex = name.search(/\d/);
        let department = name.substring(0, courseNumberIndex).trim();
        let number = name.substring(courseNumberIndex, name.indexOf(' ', courseNumberIndex)).trim();
        let courseName = name.substring(name.indexOf(' ', courseNumberIndex)).trim();

        return [courseName, department, number];
    }

    getUniqueId(row: HTMLTableRowElement): number {
        const div = row.querySelector(TableDataSelector.UNIQUE_ID);
        if (!div) {
            throw new Error('Unique ID not found');
        }
        return Number(div.textContent);
    }

    getURL(row: HTMLTableRowElement): string {
        const div = row.querySelector<HTMLAnchorElement>(`${TableDataSelector.UNIQUE_ID} a`);
        return div?.href || window.location.href;
    }

    getInstructors(row: HTMLTableRowElement): Instructor[] {
        const spans = row.querySelectorAll(TableDataSelector.INSTRUCTORS);
        const names = Array.from(spans)
            .map(span => span.textContent || '')
            .map(name => name.trim())
            .filter(Boolean);

        return names.map(name => {
            const [lastName, rest] = name.split(',').map(s => s.trim());
            const [firstName, middleInitial] = rest.split(' ');

            return {
                name,
                firstName,
                lastName,
                middleInitial,
            };
        });
    }

    isHeaderRow(row: HTMLTableRowElement): boolean {
        return row.querySelector(TableDataSelector.COURSE_HEADER) !== null;
    }

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

    getDescription(document: Document): string[] {
        const lines = document.querySelectorAll(DetailsSelector.COURSE_DESCRIPTION);
        return Array.from(lines)
            .map(line => line.textContent || '')
            .map(line => line.replace(/\s\s+/g, ' ').trim())
            .filter(Boolean);
    }

    getFullName(row?: HTMLTableRowElement): string {
        if (!row) {
            return document.querySelector(DetailsSelector.COURSE_NAME)?.textContent || '';
        }
        const div = row.querySelector(TableDataSelector.COURSE_HEADER);
        return div?.textContent || '';
    }

    getRegisterURL(row: HTMLTableRowElement): string | undefined {
        const a = row.querySelector<HTMLAnchorElement>(TableDataSelector.REGISTER_URL);
        return a?.href;
    }

    getStatus(row: HTMLTableRowElement): [status: Status, isReserved: boolean] {
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

    getFlags(row: HTMLTableRowElement): string[] {
        const lis = row.querySelectorAll(TableDataSelector.FLAGS);
        return Array.from(lis).map(li => li.textContent || '');
    }

    getSchedule(row: HTMLTableRowElement): CourseSchedule {
        const dayLines = row.querySelectorAll(TableDataSelector.SCHEDULE_DAYS);
        const hourLines = row.querySelectorAll(TableDataSelector.SCHEDULE_HOURS);
        const roomLines = row.querySelectorAll(TableDataSelector.SCHEDULE_ROOM);

        if (dayLines.length !== hourLines.length) {
            throw new Error('Schedule data is malformed');
        }

        const sections: CourseSection[] = [];

        for (let i = 0; i < dayLines.length; i += 1) {
            const lineSections = CourseSchedule.parse(
                dayLines[i].textContent || '',
                hourLines[i].textContent || '',
                roomLines[i].textContent || ''
            );
            sections.push(...lineSections);
        }

        return new CourseSchedule({
            sections,
        });
    }
}
