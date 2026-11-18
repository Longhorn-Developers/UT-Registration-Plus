import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { Course, type Semester, Status } from '@shared/types/Course';
import { CourseMeeting } from '@shared/types/CourseMeeting';
import { FIELDS_OF_STUDY } from '@shared/types/FieldOfStudy';
import { UserSchedule } from '@shared/types/UserSchedule';
import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarGrid from '@views/components/calendar/CalendarGrid';
import CourseFinderPanel from '@views/components/common/CourseFinder/CourseFinderPanel';
import type { CourseFinderPreview } from '@views/contexts/CourseFinderContext';
import type { CourseFinderStatus, UseCourseFinderReturn } from '@views/hooks/useCourseFinder';
import { useCourseFinderForm } from '@views/hooks/useCourseFinderForm';
import { useDropdown } from '@views/hooks/useDropdown';
import { useFlattenedCourseSchedule } from '@views/hooks/useFlattenedCourseSchedule';
import {
    type CourseFinderFilters,
    type CourseFinderQuery,
    DEFAULT_COURSE_FINDER_FILTERS,
    filterCourses,
    groupCourses,
} from '@views/lib/courseFinder';
import { useEffect, useMemo, useState } from 'react';

import {
    bevoCourse,
    chatterjeeCS429Course,
    exampleCourse,
    mikeScottCS314Course,
    multiMeetingMultiInstructorCourse,
} from '../injected/mocked';

const semesters: Semester[] = [
    { year: 2026, season: 'Fall', code: '20269' },
    { year: 2027, season: 'Spring', code: '20272' },
];

const mockResults: Course[] = [
    mikeScottCS314Course,
    new Course({
        ...mikeScottCS314Course,
        uniqueId: 50250,
        status: Status.WAITLISTED,
        flags: ['Writing'],
        schedule: {
            meetings: [new CourseMeeting({ days: ['Tuesday', 'Thursday'], startTime: 840, endTime: 930 })],
        },
    }),
    chatterjeeCS429Course,
    exampleCourse,
    multiMeetingMultiInstructorCourse,
    bevoCourse,
];

// In the schedule for the PreviewOnCalendar story, at the same time as the waitlisted C S 314 section (50250)
const scheduledCourse = new Course({
    ...bevoCourse,
    uniqueId: 54321,
    department: 'M',
    number: '408D',
    courseName: 'SEQUENCES, SERIES, AND MULTIVARIABLE CALCULUS',
    fullName: 'M 408D SEQUENCES, SERIES, AND MULTIVARIABLE CALCULUS',
    schedule: {
        meetings: [new CourseMeeting({ days: ['Tuesday', 'Thursday'], startTime: 870, endTime: 960 })],
    },
});

// An evening section for the PreviewOnCalendar story, which stretches the calendar past 9 PM
const eveningSection = new Course({
    ...mikeScottCS314Course,
    uniqueId: 50260,
    schedule: {
        meetings: [new CourseMeeting({ days: ['Monday'], startTime: 1110, endTime: 1290 })],
    },
});

interface MockCourseFinderProps {
    status: CourseFinderStatus;
    results: Course[];
    /** Whether the first course starts expanded */
    expandFirst?: boolean;
    /** Whether the filters start open */
    filtersOpen?: boolean;
    /** Whether to show the calendar next to the Course Finder, to preview sections on as they're hovered over */
    withCalendar?: boolean;
    /**
     * Whether searching works, starting with no search: a search finds the results in its field of study (and course
     * number), after a moment of loading
     */
    searchable?: boolean;
}

/** Whether a mocked result is one the query would find on UT's course schedule */
const isFoundBy = (course: Course, query: CourseFinderQuery) => {
    if (query.searchBy === 'core') return true;
    if (course.department !== query.department) return false;
    return query.searchBy !== 'course' || course.number === query.courseNumber;
};

/**
 * The calendar grid of the active schedule, with a section previewed over it
 */
function PreviewCalendar({ preview }: { preview: CourseFinderPreview | null }) {
    // Holding the calendar's hours, like the calendar does while the Course Finder is open
    const { courseCells, previewCells, startMinutes, endMinutes } = useFlattenedCourseSchedule(
        preview?.course ?? null,
        true
    );

    return (
        <div className='h-screen min-w-5xl flex-1 overflow-auto px-spacing-5'>
            {/* Where the calendar header goes, which the grid's sticky day names stay below */}
            <div className='h-[75px]' />
            <CalendarGrid
                courseCells={courseCells}
                previewCells={previewCells}
                highlight={preview}
                startMinutes={startMinutes}
                endMinutes={endMinutes}
                setCourse={() => {}}
            />
        </div>
    );
}

/**
 * Renders the Course Finder in a container the size of the calendar sidebar, with mocked search results,
 * since searching needs a UT login.
 */
function MockCourseFinder({
    status,
    results,
    expandFirst = false,
    filtersOpen = false,
    withCalendar = false,
    searchable = false,
}: MockCourseFinderProps) {
    const [filters, setFilters] = useState<CourseFinderFilters>(DEFAULT_COURSE_FINDER_FILTERS);
    const [preview, setPreview] = useState<CourseFinderPreview | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<ReadonlySet<string>>(
        new Set(expandFirst && results[0] ? [results[0].fullName] : [])
    );
    const semester = useDropdown<Semester>({
        items: semesters,
        // biome-ignore lint/style/noNonNullAssertion: TODO:
        getKey: s => s.code!,
        getLabel: s => `${s.season} ${s.year}`,
        defaultKey: '20269',
    });
    const form = useCourseFinderForm();
    const [search, setSearch] = useState<{ status: CourseFinderStatus; query: CourseFinderQuery | null }>({
        status: 'idle',
        query: null,
    });
    const shown: { status: CourseFinderStatus; query: CourseFinderQuery | null; results: Course[] } = searchable
        ? {
              ...search,
              results: search.status === 'done' ? results.filter(c => search.query && isFoundBy(c, search.query)) : [],
          }
        : {
              status,
              query:
                  status === 'idle'
                      ? null
                      : { searchBy: 'major', semesterCode: '20269', department: 'C S', levels: ['L', 'U'] },
              results,
          };
    const filtered = useMemo(() => filterCourses(shown.results, filters, []), [shown.results, filters]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: only set up the mocked form once
    useEffect(() => {
        if (status !== 'idle' && !searchable) form.setDepartment(FIELDS_OF_STUDY.find(f => f.code === 'C S') ?? null);
        form.setAreFiltersOpen(filtersOpen);
    }, []);

    const finder: UseCourseFinderReturn = {
        semester,
        areSemestersLoading: false,
        fieldsOfStudy: FIELDS_OF_STUDY,
        status: shown.status,
        query: shown.query,
        search: async query => {
            if (!searchable) return;
            setSearch({ status: 'loading', query });
            await new Promise(resolve => setTimeout(resolve, 900));
            setSearch(prev => (prev.query === query ? { status: 'done', query } : prev));
            // Like a real search for one course, which shows its sections right away
            if (query.searchBy === 'course') {
                setExpandedGroups(new Set(results.filter(c => isFoundBy(c, query)).map(c => c.fullName)));
            }
        },
        loadMore: () => {},
        reset: () => setSearch({ status: 'idle', query: null }),
        refresh: async () => {},
        hasMore: false,
        results: shown.results,
        groups: groupCourses(filtered),
        matchCount: filtered.length,
        availableFlags: [...new Set(shown.results.flatMap(c => c.flags))].sort(),
        filters,
        setFilters,
        expandedGroups,
        toggleGroup: fullName =>
            setExpandedGroups(prev => {
                const next = new Set(prev);
                if (!next.delete(fullName)) next.add(fullName);
                return next;
            }),
    };

    const panel = (
        // Matches the calendar sidebar's width, padding, and scrolling (see CalendarSidebar in Calendar.tsx)
        <div className='h-screen w-[20.3125rem] flex flex-none flex-col border-r border-divider bg-surface py-spacing-5'>
            <div
                style={{ scrollbarGutter: 'stable' }}
                className='relative h-full w-full flex flex-grow flex-col gap-y-spacing-6 overflow-x-clip overflow-y-auto scroll-pt-10 pb-spacing-6 pl-spacing-7 pr-2.75'
            >
                <CourseFinderPanel
                    finder={finder}
                    form={form}
                    onClose={() => {}}
                    onPreviewChange={withCalendar ? setPreview : undefined}
                />
            </div>
        </div>
    );

    if (!withCalendar) return panel;

    return (
        <div className='flex flex-row'>
            {panel}
            <PreviewCalendar preview={preview} />
        </div>
    );
}

const meta = {
    title: 'Components/Common/CourseFinder',
    component: MockCourseFinder,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    args: {
        status: 'done',
        results: mockResults,
    },
} satisfies Meta<typeof MockCourseFinder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Results: Story = {};

export const ResultsExpanded: Story = {
    args: {
        expandFirst: true,
    },
};

export const FiltersOpen: Story = {
    args: {
        filtersOpen: true,
    },
};

export const Idle: Story = {
    args: {
        status: 'idle',
        results: [],
    },
};

export const Loading: Story = {
    args: {
        status: 'loading',
        results: [],
    },
};

export const LoggedOut: Story = {
    args: {
        status: 'logged_out',
        results: [],
    },
};

export const NoResults: Story = {
    args: {
        status: 'done',
        results: [],
    },
};

/**
 * Hovering over a section previews it on the calendar. The waitlisted C S 314 section (50250) conflicts with M 408D,
 * which is in the schedule, so it's previewed as a conflict. The Monday evening section (50260) stretches the
 * calendar to 10 PM, where it stays after the preview is gone. M 408D is in the results too: hovering over its section
 * outlines its blocks, and hovering over its remove button marks them for removal.
 */
export const PreviewOnCalendar: Story = {
    args: {
        results: [...mockResults, eveningSection, scheduledCourse],
        expandFirst: true,
        withCalendar: true,
    },
    beforeEach: withScheduledCourse,
};

/**
 * Searching works here: type a course like "cs 314" and pick it to see its sections, then hover over them to preview
 * them on the calendar (with M 408D in the schedule, as in PreviewOnCalendar)
 */
export const Search: Story = {
    args: {
        status: 'idle',
        results: [...mockResults, eveningSection, scheduledCourse],
        withCalendar: true,
        searchable: true,
    },
    beforeEach: withScheduledCourse,
};

/** Makes the active schedule one with M 408D in it, for the stories that preview sections on the calendar */
async function withScheduledCourse() {
    // Wait out the store's own first write of its defaults, which would replace this schedule otherwise
    await UserScheduleStore.preload();
    const [schedules, activeIndex] = await Promise.all([
        UserScheduleStore.get('schedules'),
        UserScheduleStore.get('activeIndex'),
    ]);
    await UserScheduleStore.set({
        schedules: [
            new UserSchedule({
                id: 'course-finder-preview',
                name: 'Fall 2026',
                courses: [scheduledCourse],
                hours: scheduledCourse.creditHours,
                updatedAt: Date.now(),
            }),
        ],
        activeIndex: 0,
    });

    // Puts the schedules back afterwards, so the other stories don't show this one's conflict
    return async () => {
        await UserScheduleStore.set({ schedules, activeIndex });
    };
}
