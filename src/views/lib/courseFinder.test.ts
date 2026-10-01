import { Course, Status } from '@shared/types/Course';
import { describe, expect, it, vi } from 'vitest';

import {
    type CourseFinderFilters,
    conflictsWithSchedule,
    DEFAULT_COURSE_FINDER_FILTERS,
    fetchCourseFinderPage,
    filterCourses,
    getCourseFinderURLs,
    getCreditHoursOption,
    groupCourses,
    matchesKeyword,
    parseCourseFinderPage,
    satisfiesCore,
    searchFieldsOfStudy,
} from './courseFinder';

const fetchFromUrl = vi.hoisted(() => vi.fn());
vi.mock('@shared/messages', () => ({ background: { fetchFromUrl } }));

const RESULTS_URL =
    'https://utdirect.utexas.edu/apps/registrar/course_schedule/20269/results/?ccyys=20269&search_type_main=FIELD&fos_fl=E&level=L';

const row = ({
    unique,
    days,
    hour,
    room,
    mode = 'Face-to-face',
    instructor,
    status,
    core = '',
}: {
    unique: string;
    days: string;
    hour: string;
    room: string;
    mode?: string;
    instructor: string;
    status: string;
    core?: string;
}) => `
    <tr>
        <td data-th="Unique"><a href="/apps/registrar/course_schedule/20269/${unique}/" title="Unique number">${unique}</a></td>
        <td data-th="Days"> <span >${days}</span><br> </td>
        <td data-th="Hour"> <span >${hour}</span><br> </td>
        <td data-th="Room"> <span >${room}</span><br> </td>
        <td data-th="Instruction Mode">${mode}</td>
        <td data-th="Instructor"> <span >${instructor}</span><br> </td>
        <td data-th="Status">${status}</td>
        <td data-th="Core">
            <div class="core_block">
                <ul class="core">
                    ${
                        core
                            ? `<li class="HU" title="${core} core curriculum requirement">${core}</li>`
                            : '<li class="" title=" core curriculum requirement"></li>'
                    }
                </ul>
            </div>
        </td>
    </tr>`;

// Trimmed down from UT's course schedule results page
const RESULTS_HTML = `
<html>
<body>
    <form name="small_search" method="get" action="/apps/registrar/course_schedule/20269/results/">
        <select name="fos_fl" id="fos_fl">
            <option value="">Select a field of study</option>
            <option value="C S">C S - Computer Science</option>
            <option value="E">E - English</option>
            <option value="WGS">WGS - Women&#x27;s and Gender Studies</option>
        </select>
    </form>
    <table class="rwd-table results">
        <tbody>
            <tr><td class="course_header" colspan="8"><h2>E  316L BRITISH LITERATURE         </h2></td></tr>
            ${row({ unique: '33870', days: 'MWF', hour: '10:00 a.m.-11:00 a.m.', room: 'PAR 301', instructor: 'SMITH, JANE A', status: 'open', core: 'Humanities' })}
            ${row({ unique: '33875', days: 'TTH', hour: '2:00 p.m.-3:30 p.m.', room: 'PAR 105', mode: 'Internet', instructor: 'DOE, JOHN', status: 'closed', core: 'Humanities' })}
            <tr><td class="course_header" colspan="8"><h2>E  603A FRESHMAN ENGLISH         </h2></td></tr>
            ${row({ unique: '33880', days: 'MW', hour: '1:00 p.m.-2:30 p.m.', room: 'FAC 21', instructor: 'LEE, AMY', status: 'waitlisted' })}
        </tbody>
    </table>
    <a href="?ccyys=20269&amp;search_type_main=FIELD&amp;fos_fl=E&amp;level=L&amp;next_unique=33880" id="next_nav_link">next listing</a>
</body>
</html>`;

const page = parseCourseFinderPage(RESULTS_HTML, RESULTS_URL);
const [britLitOpen, britLitOnline, freshmanEnglish] = page.courses as [Course, Course, Course];

const filtersWith = (filters: Partial<CourseFinderFilters>): CourseFinderFilters => ({
    ...DEFAULT_COURSE_FINDER_FILTERS,
    ...filters,
});

describe('courseFinder::getCourseFinderURLs', () => {
    it('searches a field of study once per level', () => {
        const urls = getCourseFinderURLs({
            searchBy: 'major',
            semesterCode: '20269',
            department: 'C S',
            levels: ['L', 'U'],
        });

        expect(urls).toEqual([
            'https://utdirect.utexas.edu/apps/registrar/course_schedule/20269/results/?ccyys=20269&search_type_main=FIELD&fos_fl=C+S&level=L',
            'https://utdirect.utexas.edu/apps/registrar/course_schedule/20269/results/?ccyys=20269&search_type_main=FIELD&fos_fl=C+S&level=U',
        ]);
    });

    it('searches a core curriculum area by its core code', () => {
        const [url] = getCourseFinderURLs({ searchBy: 'core', semesterCode: '20272', coreCode: '040' });
        const params = new URL(url ?? '').searchParams;

        expect(params.get('search_type_main')).toBe('CORE');
        expect(params.get('core_code')).toBe('040');
        expect(params.get('ccyys')).toBe('20272');
    });

    it('searches a specific course number', () => {
        const [url] = getCourseFinderURLs({
            searchBy: 'course',
            semesterCode: '20269',
            department: 'M',
            courseNumber: ' 408d ',
        });

        expect(url).toBe(
            'https://utdirect.utexas.edu/apps/registrar/course_schedule/20269/results/?ccyys=20269&search_type_main=COURSE&fos_cn=M&course_number=408D'
        );
    });
});

describe('courseFinder::parseCourseFinderPage', () => {
    it('scrapes every section on the page', () => {
        expect(page.courses.map(c => c.uniqueId)).toEqual([33870, 33875, 33880]);
        expect(britLitOpen.department).toBe('E');
        expect(britLitOpen.number).toBe('316L');
        expect(britLitOpen.courseName).toBe('BRITISH LITERATURE');
        expect(britLitOpen.core).toEqual(['Humanities']);
        expect(freshmanEnglish.core).toEqual([]);
        expect(freshmanEnglish.creditHours).toBe(3);
        expect(britLitOnline.instructionMode).toBe('Online');
        expect(britLitOpen.semester).toEqual({ year: 2026, season: 'Fall', code: '20269' });
    });

    it('resolves links against UT instead of the page that parsed them', () => {
        expect(britLitOpen.url).toBe('https://utdirect.utexas.edu/apps/registrar/course_schedule/20269/33870/');
        expect(page.nextPageURL).toBe(
            'https://utdirect.utexas.edu/apps/registrar/course_schedule/20269/results/?ccyys=20269&search_type_main=FIELD&fos_fl=E&level=L&next_unique=33880'
        );
    });

    it('reads the fields of study from the search form', () => {
        expect(page.fieldsOfStudy).toEqual([
            { code: 'C S', name: 'Computer Science' },
            { code: 'E', name: 'English' },
            { code: 'WGS', name: "Women's and Gender Studies" },
        ]);
    });

    it('handles a page without results, like the login page', () => {
        const empty = parseCourseFinderPage('<html><body><form id="login"></form></body></html>', RESULTS_URL);

        expect(empty).toEqual({ courses: [], nextPageURL: undefined, fieldsOfStudy: [] });
    });
});

describe('courseFinder::fetchCourseFinderPage', () => {
    it('parses the page from the background fetch proxy', async () => {
        fetchFromUrl.mockResolvedValueOnce(RESULTS_HTML);
        const fetched = await fetchCourseFinderPage(RESULTS_URL);

        expect(fetched.courses.map(c => c.uniqueId)).toEqual([33870, 33875, 33880]);
    });

    it('gives up when UT never responds', async () => {
        vi.useFakeTimers();
        try {
            fetchFromUrl.mockReturnValueOnce(new Promise(() => {}));
            const assertion = expect(fetchCourseFinderPage(RESULTS_URL)).rejects.toThrow('Timed out');
            await vi.advanceTimersByTimeAsync(20_000);
            await assertion;
        } finally {
            vi.useRealTimers();
        }
    });
});

describe('courseFinder::searchFieldsOfStudy', () => {
    const fields = [
        { code: 'C E', name: 'Civil Engineering' },
        { code: 'C S', name: 'Computer Science' },
        { code: 'CH', name: 'Chemistry' },
        { code: 'CHE', name: 'Chemical Engineering' },
        { code: 'COE', name: 'Computational Engineering' },
        { code: 'ECE', name: 'Electrical/Computer Engineering' },
    ];
    const codes = (search: string) => searchFieldsOfStudy(fields, search).map(f => f.code);

    it('returns every field of study for an empty search', () => {
        expect(codes('  ')).toEqual(['C E', 'C S', 'CH', 'CHE', 'COE', 'ECE']);
    });

    it('ranks exact codes first, ignoring spaces and case', () => {
        expect(codes('cs')).toEqual(['C S']);
        expect(codes('C S')).toEqual(['C S']);
        expect(codes('ch')).toEqual(['CH', 'CHE']);
    });

    it('matches names after codes', () => {
        expect(codes('comp')).toEqual(['C S', 'COE', 'ECE']);
        expect(codes('engineering')).toEqual(['C E', 'CHE', 'COE', 'ECE']);
    });
});

describe('courseFinder::getCreditHoursOption', () => {
    it('buckets credit hours, capping at 5+', () => {
        expect([0, 1, 1.5, 3, 4, 5, 6].map(getCreditHoursOption)).toEqual([0, 1, 1, 3, 4, 5, 5]);
    });
});

describe('courseFinder::satisfiesCore', () => {
    it('matches the core area by name', () => {
        expect(satisfiesCore(britLitOpen, '040')).toBe(true);
        expect(satisfiesCore(britLitOpen, '010')).toBe(false);
        expect(satisfiesCore(freshmanEnglish, '040')).toBe(false);
    });

    it('matches older names for a core area', () => {
        const course = new Course({ ...freshmanEnglish, core: ['English Composition'] });

        expect(satisfiesCore(course, '010')).toBe(true);
    });
});

describe('courseFinder::matchesKeyword', () => {
    it('matches title, course number, instructor, and unique number', () => {
        expect(matchesKeyword(britLitOpen, '')).toBe(true);
        expect(matchesKeyword(britLitOpen, 'british lit')).toBe(true);
        expect(matchesKeyword(britLitOpen, 'E 316L')).toBe(true);
        expect(matchesKeyword(britLitOpen, 'e316l')).toBe(true);
        expect(matchesKeyword(britLitOpen, 'smith')).toBe(true);
        expect(matchesKeyword(britLitOpen, '33870')).toBe(true);
        expect(matchesKeyword(britLitOpen, 'freshman')).toBe(false);
    });
});

describe('courseFinder::filterCourses', () => {
    const ids = (courses: Course[]) => courses.map(c => c.uniqueId);

    it('keeps every course with the default filters', () => {
        expect(ids(filterCourses(page.courses, DEFAULT_COURSE_FINDER_FILTERS, []))).toEqual([33870, 33875, 33880]);
    });

    it('filters by core curriculum', () => {
        expect(ids(filterCourses(page.courses, filtersWith({ coreCode: '040' }), []))).toEqual([33870, 33875]);
    });

    it('filters by any of the selected credit hours', () => {
        const sixHour = new Course({ ...freshmanEnglish, uniqueId: 33885, creditHours: 6 });
        const courses = [...page.courses, sixHour];

        expect(ids(filterCourses(courses, filtersWith({ creditHours: [5] }), []))).toEqual([33885]);
        expect(ids(filterCourses(courses, filtersWith({ creditHours: [3, 5] }), []))).toEqual([
            33870, 33875, 33880, 33885,
        ]);
        expect(ids(filterCourses(courses, filtersWith({ creditHours: [4] }), []))).toEqual([]);
    });

    it('filters by status and instruction mode', () => {
        expect(ids(filterCourses(page.courses, filtersWith({ openOnly: true }), []))).toEqual([33870]);
        expect(ids(filterCourses(page.courses, filtersWith({ instructionMode: 'Online' }), []))).toEqual([33875]);
        expect(britLitOpen.status).toBe(Status.OPEN);
    });

    it('requires every selected flag', () => {
        const writing = new Course({ ...britLitOpen, flags: ['Writing'] });
        const writingAndEthics = new Course({ ...britLitOnline, flags: ['Writing', 'Ethics'] });
        const courses = [writing, writingAndEthics, freshmanEnglish];

        expect(ids(filterCourses(courses, filtersWith({ flags: ['Writing'] }), []))).toEqual([33870, 33875]);
        expect(ids(filterCourses(courses, filtersWith({ flags: ['Writing', 'Ethics'] }), []))).toEqual([33875]);
    });

    it('hides sections that conflict with the schedule', () => {
        // MWF 10-11 overlaps with E 316L (33870), but not with the TTH or MW 1-2:30 sections
        const scheduled = new Course({
            ...britLitOpen,
            uniqueId: 50000,
            fullName: 'C S 314 DATA STRUCTURES',
        });

        expect(conflictsWithSchedule(britLitOpen, [scheduled])).toBe(true);
        expect(conflictsWithSchedule(britLitOpen, [britLitOpen])).toBe(false);
        expect(ids(filterCourses(page.courses, filtersWith({ hideConflicts: true }), [scheduled]))).toEqual([
            33875, 33880,
        ]);
    });
});

describe('courseFinder::groupCourses', () => {
    it('groups sections by course in the order they appear', () => {
        const groups = groupCourses(page.courses);

        expect(groups.map(g => [g.fullName, g.sections.map(c => c.uniqueId)])).toEqual([
            ['E 316L BRITISH LITERATURE', [33870, 33875]],
            ['E 603A FRESHMAN ENGLISH', [33880]],
        ]);
    });
});
