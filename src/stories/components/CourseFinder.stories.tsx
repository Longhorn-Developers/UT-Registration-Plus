import { Course, type Semester, Status } from '@shared/types/Course';
import { CourseMeeting } from '@shared/types/CourseMeeting';
import { FIELDS_OF_STUDY } from '@shared/types/FieldOfStudy';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CourseFinder } from '@views/components/common/CourseFinder/CourseFinderDialog';
import Dialog from '@views/components/common/Dialog';
import type { CourseFinderStatus, UseCourseFinderReturn } from '@views/hooks/useCourseFinder';
import { useCourseFinderForm } from '@views/hooks/useCourseFinderForm';
import { useDropdown } from '@views/hooks/useDropdown';
import {
    type CourseFinderFilters,
    DEFAULT_COURSE_FINDER_FILTERS,
    filterCourses,
    groupCourses,
} from '@views/lib/courseFinder';
import { useMemo, useState } from 'react';

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
}

/**
 * Renders the Course Finder with mocked search results, since searching needs a UT login.
 */
function MockCourseFinder({ status, results }: MockCourseFinderProps) {
    const [filters, setFilters] = useState<CourseFinderFilters>(DEFAULT_COURSE_FINDER_FILTERS);
    const semester = useDropdown<Semester>({
        items: semesters,
        // biome-ignore lint/style/noNonNullAssertion: TODO:
        getKey: s => s.code!,
        getLabel: s => `${s.season} ${s.year}`,
        defaultKey: '20269',
    });
    const [collapsedGroups, setCollapsedGroups] = useState<ReadonlySet<string>>(new Set());
    const form = useCourseFinderForm();
    const filtered = useMemo(() => filterCourses(results, filters, []), [results, filters]);

    const finder: UseCourseFinderReturn = {
        semester,
        fieldsOfStudy: FIELDS_OF_STUDY,
        status,
        query:
            status === 'idle' ? null : { searchBy: 'major', semesterCode: '20269', department: 'C S', levels: ['L'] },
        search: async () => {},
        loadMore: () => {},
        hasMore: status === 'done' && results.length > 0,
        results,
        groups: groupCourses(filtered),
        matchCount: filtered.length,
        availableFlags: [...new Set(results.flatMap(c => c.flags))].sort(),
        filters,
        setFilters,
        collapsedGroups,
        toggleGroup: fullName =>
            setCollapsedGroups(prev => {
                const next = new Set(prev);
                if (!next.delete(fullName)) next.add(fullName);
                return next;
            }),
    };

    return (
        <Dialog className='h-[85vh] w-[780px] max-w-[calc(100vw-1rem)] overflow-y-hidden' open onClose={() => {}}>
            <CourseFinder finder={finder} form={form} onClose={() => {}} />
        </Dialog>
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
