import type { Course, Semester } from '@shared/types/Course';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { act, type ChangeEvent } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type CourseResult, type UseQuickAddReturn, useQuickAdd } from '../useQuickAdd';

// Lets React know updates in these tests are wrapped in act()
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const FALL_2026: Semester = { year: 2026, season: 'Fall', code: '20269' };
const SPRING_2026: Semester = { year: 2026, season: 'Spring', code: '20262' };
const SUMMER_2026: Semester = { year: 2026, season: 'Summer', code: '20266' };

const mocks = vi.hoisted(() => ({
    // The same object on every render, like the store gives until the schedule changes
    schedule: { courses: [] } as unknown as UserSchedule,
    coursesOnUT: new Map<string, Course>(),
}));

vi.mock('@pages/background/lib/fetchAvailableSemesters', () => ({
    fetchAvailableSemesters: () => Promise.resolve([SPRING_2026, SUMMER_2026, FALL_2026]),
}));

// UT's course schedule, by the semester code and unique number in a course's URL
vi.mock('@pages/background/lib/getCourseByURL', () => ({
    getCourseByURL: (url: string) => {
        const [, code, unique] = url.match(/course_schedule\/(\d+)\/(\d+)\//) ?? [];
        return Promise.resolve(mocks.coursesOnUT.get(`${code}/${unique}`) ?? null);
    },
}));

vi.mock('@views/hooks/useSchedules', () => ({
    default: () => [mocks.schedule, []],
}));

const course = (uniqueId: number, semester: Semester, fullName: string) => ({ uniqueId, semester, fullName }) as Course;

// The nursing course from the bug report: 60810 is a different course in each semester
const NURSING_SPRING = course(60810, SPRING_2026, 'N 344P');
const NEURO_FALL = course(60810, FALL_2026, 'NEU 383D');
const OTHER_FALL = course(50805, FALL_2026, 'C S 314');

let quickAdd: UseQuickAddReturn;
let container: HTMLDivElement;
let root: Root;

function Harness() {
    quickAdd = useQuickAdd(true);
    return null;
}

/** Shows the hook with the given courses in the schedule, and waits for the semesters to load */
const render = async (scheduleCourses: Course[]) => {
    mocks.schedule = {
        courses: scheduleCourses,
        // UserSchedule's own check, by unique number alone, which Quick Add used before it compared semesters too
        containsCourse: (c: Course) => scheduleCourses.some(other => other.uniqueId === c.uniqueId),
    } as unknown as UserSchedule;
    await act(async () => root.render(<Harness />));
};

/** Types a unique number, picking a semester first if one's given, and waits for the lookup */
const lookUp = async (unique: number, semester?: Semester) => {
    if (semester) {
        act(() => quickAdd.semester.onOptionChange({ id: semester.code ?? '', label: '' }));
    }
    await act(async () =>
        quickAdd.uniqueNumber.handleChange({ target: { value: String(unique) } } as ChangeEvent<HTMLInputElement>)
    );
};

const result = (): CourseResult => quickAdd.courseResult;

beforeEach(() => {
    mocks.coursesOnUT = new Map(
        [NURSING_SPRING, NEURO_FALL, OTHER_FALL].map(c => [`${c.semester.code}/${c.uniqueId}`, c])
    );
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
});

describe('useQuickAdd', () => {
    it("lets a course from the schedule's semester be added", async () => {
        await render([OTHER_FALL]);
        await lookUp(60810, FALL_2026);
        expect(result()).toEqual({ status: 'found', course: NEURO_FALL });
    });

    it("doesn't take a section from another semester that has the same unique number as one in the schedule", async () => {
        await render([NEURO_FALL]);
        await lookUp(60810, SPRING_2026);
        // Not "already in your schedule": that's a different course
        expect(result()).toEqual({
            status: 'other_semester',
            course: NURSING_SPRING,
            scheduleSemesters: [FALL_2026],
        });
    });

    it('still says a course is already in the schedule when it is', async () => {
        await render([NEURO_FALL]);
        await lookUp(60810, FALL_2026);
        expect(result()).toEqual({ status: 'already_added' });
    });

    it('takes a course from any semester into an empty schedule', async () => {
        await render([]);
        await lookUp(60810, SPRING_2026);
        expect(result()).toEqual({ status: 'found', course: NURSING_SPRING });
    });

    it('names every semester of a schedule that already mixes them, once each and oldest first', async () => {
        const spring = course(50810, SPRING_2026, 'C S 429');
        await render([OTHER_FALL, spring, NEURO_FALL]);
        const summer = course(12345, SUMMER_2026, 'M 408D');
        mocks.coursesOnUT.set('20266/12345', summer);
        await lookUp(12345, SUMMER_2026);
        expect(result()).toEqual({
            status: 'other_semester',
            course: summer,
            scheduleSemesters: [SPRING_2026, FALL_2026],
        });
    });

    it("won't put two sections with the same unique number in a schedule that already mixes semesters", async () => {
        // Removing either would remove both, since the schedule tells its courses apart by unique number
        await render([NEURO_FALL, course(50810, SPRING_2026, 'C S 429')]);
        await lookUp(60810, SPRING_2026);
        expect(result()).toEqual({ status: 'unique_taken', scheduledCourse: NEURO_FALL });
    });

    it("starts on the schedule's semester", async () => {
        await render([OTHER_FALL]);
        expect(quickAdd.semester.selectedItem).toEqual(FALL_2026);
    });

    it('starts on the first semester UT lists for an empty schedule', async () => {
        await render([]);
        expect(quickAdd.semester.selectedItem).toEqual(SPRING_2026);
    });
});
