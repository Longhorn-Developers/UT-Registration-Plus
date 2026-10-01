import { background } from '@shared/messages';
import { type Course, type InstructionMode, Status } from '@shared/types/Course';
import type { FieldOfStudy } from '@shared/types/FieldOfStudy';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import { SiteSupport } from '@views/lib/getSiteSupport';
import { getNextButton } from '@views/lib/loadNextCourseCatalogPage';

const COURSE_SCHEDULE_URL = 'https://utdirect.utexas.edu/apps/registrar/course_schedule';

/**
 * The core curriculum areas, keyed by UT's core code.
 * The names match what the course schedule lists in its "Core" column (and `coreMap` in Chip.tsx),
 * the labels are short enough to fit in a dropdown.
 */
export const CORE_CURRICULUM = [
    { code: '090', name: 'First-Year Signature Course', label: 'First-Year Signature Course' },
    { code: '010', name: 'Communication', label: 'Communication' },
    { code: '020', name: 'Mathematics', label: 'Mathematics' },
    { code: '030', name: 'Natural Science and Technology, Part I', label: 'Natural Science & Tech I' },
    { code: '093', name: 'Natural Science and Technology, Part II', label: 'Natural Science & Tech II' },
    { code: '040', name: 'Humanities', label: 'Humanities' },
    { code: '050', name: 'Visual and Performing Arts', label: 'Visual & Performing Arts' },
    { code: '060', name: 'U.S. History', label: 'U.S. History' },
    { code: '070', name: 'American and Texas Government', label: 'American & Texas Government' },
    { code: '080', name: 'Social and Behavioral Sciences', label: 'Social & Behavioral Science' },
] as const;

/**
 * A core curriculum area, i.e. `{ code: '040', name: 'Humanities' }`
 */
export type CoreCurriculumArea = (typeof CORE_CURRICULUM)[number];

/**
 * UT's code for a core curriculum area, i.e. '040' for Humanities
 */
export type CoreCode = CoreCurriculumArea['code'];

/**
 * Older course schedules list some core areas under a previous name
 */
const CORE_ALIASES: Partial<Record<CoreCode, string[]>> = {
    '010': ['English Composition'],
};

/**
 * The course levels UT lets you search a field of study by: [L]ower division, [U]pper division, and [G]raduate
 */
export const CourseLevel = {
    LOWER: 'L',
    UPPER: 'U',
    GRADUATE: 'G',
} as const;

/**
 * Represents the type of course level.
 * It is a union type that includes all the values of the CourseLevel object.
 */
export type CourseLevelType = (typeof CourseLevel)[keyof typeof CourseLevel];

/**
 * What the user is searching UT's course schedule for
 *
 * - `major`: every course in a field of study, at one or more levels
 * - `core`: every course that satisfies a core curriculum area
 * - `course`: every section of a specific course, i.e. C S 314
 */
export type CourseFinderQuery =
    | { searchBy: 'major'; semesterCode: string; department: string; levels: CourseLevelType[] }
    | { searchBy: 'core'; semesterCode: string; coreCode: CoreCode }
    | { searchBy: 'course'; semesterCode: string; department: string; courseNumber: string };

/**
 * Builds the course schedule result URLs to fetch for a query.
 * Searching a field of study at multiple levels takes one search per level.
 *
 * @param query - what to search for
 * @returns the URL of the first results page for each search
 */
export function getCourseFinderURLs(query: CourseFinderQuery): string[] {
    const resultsURL = `${COURSE_SCHEDULE_URL}/${query.semesterCode}/results/`;
    const toURL = (params: Record<string, string>) =>
        `${resultsURL}?${new URLSearchParams({ ccyys: query.semesterCode, ...params })}`;

    switch (query.searchBy) {
        case 'major':
            return query.levels.map(level => toURL({ search_type_main: 'FIELD', fos_fl: query.department, level }));
        case 'core':
            return [toURL({ search_type_main: 'CORE', core_code: query.coreCode })];
        case 'course':
            return [
                toURL({
                    search_type_main: 'COURSE',
                    fos_cn: query.department,
                    course_number: query.courseNumber.trim().toUpperCase(),
                }),
            ];
        default:
            throw new Error('Unknown course finder query');
    }
}

/**
 * A single page of course schedule search results
 */
export type CourseFinderPage = {
    /** The course sections listed on the page */
    courses: Course[];
    /** The URL of the next page of results, if there is one */
    nextPageURL?: string;
    /** The fields of study from the page's "Modify your search" form */
    fieldsOfStudy: FieldOfStudy[];
};

/**
 * Parses a page of course schedule search results
 *
 * @param html - the HTML of the results page
 * @param url - the URL the page was fetched from
 * @returns the courses, the next page, and the fields of study on the page
 */
export function parseCourseFinderPage(html: string, url: string): CourseFinderPage {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // UT's links are relative, so resolve them against UT instead of the extension page that parsed them
    const base = doc.createElement('base');
    base.href = url;
    doc.head.prepend(base);

    const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_LIST, doc, url);
    const courses = scraper.scrape(getCourseTableRows(doc), false).flatMap(row => (row.course ? [row.course] : []));

    return {
        courses,
        nextPageURL: getNextButton(doc)?.href || undefined,
        fieldsOfStudy: parseFieldsOfStudy(doc),
    };
}

/**
 * Reads the fields of study from the field of study dropdown on a course schedule page
 *
 * @param doc - the course schedule page
 * @returns the fields of study, or an empty array if the page doesn't have the dropdown
 */
export function parseFieldsOfStudy(doc: Document): FieldOfStudy[] {
    const options = doc.querySelectorAll<HTMLOptionElement>('select#fos_fl option');

    return Array.from(options).flatMap(option => {
        const code = option.value.trim();
        if (!code) return [];

        // Options look like "C S - Computer Science"
        const label = (option.textContent || '').trim();
        const name = label.startsWith(`${code} - `) ? label.slice(code.length + 3) : label;

        return [{ code, name: name.trim() }];
    });
}

/**
 * Finds the fields of study that match what the user typed, best matches first
 *
 * @param fieldsOfStudy - the fields of study to search
 * @param search - a department code or name, i.e. "cs", "C S", or "computer"
 * @returns exact code matches, then code prefixes, then names that start with or contain the search
 */
export function searchFieldsOfStudy(fieldsOfStudy: readonly FieldOfStudy[], search: string): FieldOfStudy[] {
    const name = search.trim().toLowerCase();
    const code = name.replace(/\s+/g, '');
    if (!code) return [...fieldsOfStudy];

    const ranked = fieldsOfStudy.flatMap(field => {
        const fieldCode = field.code.toLowerCase().replace(/\s+/g, '');
        const fieldName = field.name.toLowerCase();

        if (fieldCode === code) return [{ field, rank: 0 }];
        if (fieldCode.startsWith(code)) return [{ field, rank: 1 }];
        if (fieldName.startsWith(name)) return [{ field, rank: 2 }];
        if (fieldName.includes(name)) return [{ field, rank: 3 }];
        return [];
    });

    // sort is stable, so each rank keeps the original (alphabetical) order
    return ranked.sort((a, b) => a.rank - b.rank).map(({ field }) => field);
}

/**
 * Fetches and parses a page of course schedule search results through the background fetch proxy.
 *
 * This must be called from an extension page or content script (not the background service worker),
 * as it relies on DOMParser.
 *
 * @param url - the URL of the results page
 * @returns the parsed page
 */
export async function fetchCourseFinderPage(url: string): Promise<CourseFinderPage> {
    const html = await background.fetchFromUrl({
        url,
        method: 'GET',
        response: 'text',
    });

    if (!html) {
        return { courses: [], fieldsOfStudy: [] };
    }

    return parseCourseFinderPage(html, url);
}

/**
 * The highest credit hour option, which also matches anything above it (5+ hours)
 */
export const MAX_CREDIT_HOURS_OPTION = 5;

/**
 * The credit hour options a user can filter by
 */
export const CREDIT_HOURS_OPTIONS = [1, 2, 3, 4, MAX_CREDIT_HOURS_OPTION] as const;

/**
 * The filters a user can narrow down course search results with
 */
export interface CourseFinderFilters {
    /** Matches the course title, department and number, instructors, or unique number */
    keyword: string;
    /** Matches any of the credit hour options, an empty array matches every course */
    creditHours: number[];
    /** The core curriculum area the course has to satisfy */
    coreCode: CoreCode | null;
    /** The flags the course has to carry, all of them */
    flags: string[];
    /** How the course has to be taught */
    instructionMode: InstructionMode | null;
    /** Only show sections that are open */
    openOnly: boolean;
    /** Hide sections that conflict with a course in the schedule */
    hideConflicts: boolean;
}

/**
 * Filters that match every course
 */
export const DEFAULT_COURSE_FINDER_FILTERS: CourseFinderFilters = {
    keyword: '',
    creditHours: [],
    coreCode: null,
    flags: [],
    instructionMode: null,
    openOnly: false,
    hideConflicts: false,
};

/**
 * Gets the credit hour option a number of credit hours falls under
 *
 * @param creditHours - the course's credit hours
 * @returns the credit hour option, capped at {@link MAX_CREDIT_HOURS_OPTION}
 * @example
 * ```ts
 * getCreditHoursOption(3)   // 3
 * getCreditHoursOption(1.5) // 1
 * getCreditHoursOption(6)   // 5 (5+)
 * ```
 */
export function getCreditHoursOption(creditHours: number): number {
    return Math.min(Math.floor(creditHours), MAX_CREDIT_HOURS_OPTION);
}

/**
 * Checks whether a course satisfies a core curriculum area
 *
 * @param course - the course to check
 * @param coreCode - the core curriculum area
 * @returns true if the course lists the area in its core curriculum
 */
export function satisfiesCore(course: Course, coreCode: CoreCode): boolean {
    const area = CORE_CURRICULUM.find(c => c.code === coreCode);
    if (!area) return false;

    const names = [area.name, ...(CORE_ALIASES[coreCode] ?? [])];
    return course.core.some(core => names.includes(core.trim()));
}

/**
 * Checks whether any of a course's meetings overlap with a course in the schedule
 *
 * @param course - the course to check
 * @param scheduledCourses - the courses in the schedule
 * @returns true if the course conflicts with a different course in the schedule
 */
export function conflictsWithSchedule(course: Course, scheduledCourses: Course[]): boolean {
    return scheduledCourses.some(c => c.uniqueId !== course.uniqueId && course.getConflicts(c).length > 0);
}

/**
 * Checks whether a course matches a search keyword
 *
 * @param course - the course to check
 * @param keyword - the keyword, i.e. "data structures", "C S 314", "norman", or "50245"
 * @returns true if the keyword is empty or the course matches it
 */
export function matchesKeyword(course: Course, keyword: string): boolean {
    const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, '');
    const needle = normalize(keyword);
    if (!needle) return true;

    const haystack = [
        course.courseName,
        `${course.department}${course.number}`,
        String(course.uniqueId).padStart(5, '0'),
        ...course.instructors.map(i => i.fullName ?? ''),
    ];

    return haystack.some(text => normalize(text).includes(needle));
}

/**
 * Applies the course finder filters to a list of courses
 *
 * @param courses - the courses to filter
 * @param filters - the filters to apply
 * @param scheduledCourses - the courses in the active schedule, used to hide time conflicts
 * @returns the courses that match every filter, in their original order
 */
export function filterCourses(courses: Course[], filters: CourseFinderFilters, scheduledCourses: Course[]): Course[] {
    return courses.filter(course => {
        if (filters.creditHours.length > 0 && !filters.creditHours.includes(getCreditHoursOption(course.creditHours))) {
            return false;
        }
        if (filters.coreCode && !satisfiesCore(course, filters.coreCode)) {
            return false;
        }
        if (filters.flags.some(flag => !course.flags.includes(flag))) {
            return false;
        }
        if (filters.instructionMode && course.instructionMode !== filters.instructionMode) {
            return false;
        }
        if (filters.openOnly && course.status !== Status.OPEN) {
            return false;
        }
        if (filters.hideConflicts && conflictsWithSchedule(course, scheduledCourses)) {
            return false;
        }
        return matchesKeyword(course, filters.keyword);
    });
}

/**
 * All the sections of a course in the search results
 */
export type CourseFinderGroup = {
    /** The full name of the course, which is unique per course (and per topic for topics courses) */
    fullName: string;
    /** The sections of the course */
    sections: Course[];
};

/**
 * Groups course sections by course, the way UT's course schedule lists them
 *
 * @param courses - the course sections
 * @returns the groups in the order their first section appears
 */
export function groupCourses(courses: Course[]): CourseFinderGroup[] {
    const groups = new Map<string, CourseFinderGroup>();

    for (const course of courses) {
        const group = groups.get(course.fullName);
        if (group) {
            group.sections.push(course);
        } else {
            groups.set(course.fullName, { fullName: course.fullName, sections: [course] });
        }
    }

    return [...groups.values()];
}
