import { Instructor, Status } from 'src/shared/types/Course';
import { SiteSupport } from 'src/views/lib/getSiteSupport';

enum TableDataSelector {
    UNIQUE_ID = 'td[data-th="Unique"]',
    REGISTER_URL = 'td[data-th="Add"] a',
    INSTRUCTORS = 'td[data-th="Instructor"] span',
    STATUS = 'td[data-th="Status"]',
    SCHEDULE_DAYS = 'td[data-th="Days"]>span',
    SCHEDULE_HOURS = 'td[data-th="Hour"]>span',
    SCHEDULE_ROOM = 'td[data-th="Room"]>span',
    FLAGS = 'td[data-th="Flags"] ul li',
}

enum CatalogDetailsSelector {
    COURSE_NAME = '#details h2',
    COURSE_DESCRIPTION = '#details p',
}

export class CourseScraper {
    support: SiteSupport;
    row: HTMLTableRowElement;

    constructor(support: SiteSupport, row: HTMLTableRowElement) {
        this.support = support;
        this.row = row;
    }

    scrapeUniqueId(): number {
        const div = this.row.querySelector(TableDataSelector.UNIQUE_ID);
        if (!div) {
            throw new Error('Unique ID not found');
        }
        return Number(div.textContent);
    }

    scrapeInstructors(): Instructor[] {
        const spans = this.row.querySelectorAll(TableDataSelector.INSTRUCTORS);
        const names = Array.from(spans)
            .map(span => span.textContent || '')
            .map(name => name.trim())
            .filter(Boolean);

        return names.map(name => {
            const [lastName, rest] = name.split(',');
            const [firstName, middleInitial] = rest.split(' ');

            return {
                name,
                firstName,
                lastName,
                middleInitial,
            };
        });
    }

    scrapeName(): string {
        const div = document.querySelector(CatalogDetailsSelector.COURSE_NAME);
        if (!div) {
            throw new Error('Course name not found');
        }
        return div.textContent || '';
    }

    scrapeRegisterURL(): string | undefined {
        const a = this.row.querySelector<HTMLAnchorElement>(TableDataSelector.REGISTER_URL);
        return a?.href;
    }

    scrapeStatus(): [status: Status, isReserved: boolean] {
        const div = this.row.querySelector(TableDataSelector.STATUS);
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

    scrapeFlags(): string[] {
        const lis = this.row.querySelectorAll(TableDataSelector.FLAGS);
        return Array.from(lis).map(li => li.textContent || '');
    }

    scrapeDescription(): string[] {
        const lines = document.querySelectorAll(CatalogDetailsSelector.COURSE_DESCRIPTION);
        return Array.from(lines)
            .map(line => line.textContent || '')
            .filter(Boolean);
    }

    scrapeSchedule(): CourseSchedule {
        const days = this.row.querySelectorAll(TableDataSelector.SCHEDULE_DAYS);
        const hours = this.row.querySelectorAll(TableDataSelector.SCHEDULE_HOURS);
        const rooms = this.row.querySelectorAll(TableDataSelector.SCHEDULE_ROOM);

        if (days.length !== hours.length) {
            throw new Error('Schedule data is malformed');
        }

        // const schedule:  = [];
        // for (let i = 0; i < days.length; i++) {
        //     const day = days[i].textContent || '';
        //     const hour = hours[i].textContent || '';
        //     const room = rooms[i].textContent || '';

        //     schedule.push({
        //         day,
        //         hour,
        //         room,
        //     });
        // }
        // return schedule;
    }
}
