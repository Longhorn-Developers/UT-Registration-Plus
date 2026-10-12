import { Course, type Semester, Status } from '@shared/types/Course';
import { CourseMeeting } from '@shared/types/CourseMeeting';
import { FIELDS_OF_STUDY } from '@shared/types/FieldOfStudy';
import type { Meta, StoryObj } from '@storybook/react-vite';
import CourseFinderPanel from '@views/components/common/CourseFinder/CourseFinderPanel';
import type { CourseFinderStatus, UseCourseFinderReturn } from '@views/hooks/useCourseFinder';
import { useCourseFinderForm } from '@views/hooks/useCourseFinderForm';
import { useDropdown } from '@views/hooks/useDropdown';
import {
    type CourseFinderFilters,
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

interface MockCourseFinderProps {
    status: CourseFinderStatus;
    results: Course[];
    /** Whether the first course starts expanded */
    expandFirst?: boolean;
    /** Whether the filters start open */
    filtersOpen?: boolean;
}

/**
 * Renders the Course Finder in a container the size of the calendar sidebar, with mocked search results,
 * since searching needs a UT login.
 */
function MockCourseFinder({ status, results, expandFirst = false, filtersOpen = false }: MockCourseFinderProps) {
    const [filters, setFilters] = useState<CourseFinderFilters>(DEFAULT_COURSE_FINDER_FILTERS);
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
    const filtered = useMemo(() => filterCourses(results, filters, []), [results, filters]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: only set up the mocked form once
    useEffect(() => {
        if (status !== 'idle') form.setDepartment(FIELDS_OF_STUDY.find(f => f.code === 'C S') ?? null);
        form.setAreFiltersOpen(filtersOpen);
    }, []);

    const finder: UseCourseFinderReturn = {
        semester,
        areSemestersLoading: false,
        fieldsOfStudy: FIELDS_OF_STUDY,
        status,
        query:
            status === 'idle'
                ? null
                : { searchBy: 'major', semesterCode: '20269', department: 'C S', levels: ['L', 'U'] },
        search: async () => {},
        loadMore: () => {},
        reset: () => {},
        hasMore: false,
        results,
        groups: groupCourses(filtered),
        matchCount: filtered.length,
        availableFlags: [...new Set(results.flatMap(c => c.flags))].sort(),
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

    return (
        // Matches the calendar sidebar's width, padding, and scrolling (see CalendarSidebar in Calendar.tsx)
        <div className='h-screen w-[20.3125rem] flex flex-col border-r border-ut-offwhite/50 bg-white py-spacing-5'>
            <div
                style={{ scrollbarGutter: 'stable' }}
                className='relative h-full w-full flex flex-grow flex-col gap-y-spacing-6 overflow-x-clip overflow-y-auto scroll-pt-10 pb-spacing-6 pl-spacing-7 pr-2.75'
            >
                <CourseFinderPanel finder={finder} form={form} onClose={() => {}} />
            </div>
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
