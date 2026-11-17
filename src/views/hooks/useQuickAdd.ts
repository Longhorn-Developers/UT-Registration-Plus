import { fetchAvailableSemesters } from '@pages/background/lib/fetchAvailableSemesters';
import { getCourseByURL } from '@pages/background/lib/getCourseByURL';
import { type Course, type Semester, UNIQUE_ID_LENGTH } from '@shared/types/Course';
import { type UseDropdownReturn, useDropdown } from '@views/hooks/useDropdown';
import { useNumericInput } from '@views/hooks/useNumericInput';
import useSchedules from '@views/hooks/useSchedules';
import { useEffect, useMemo, useState } from 'react';

/**
 * Represents the state of the async course lookup.
 *
 * - `idle`: No lookup has been initiated (input is incomplete or empty).
 * - `loading`: A lookup is in progress.
 * - `found`: A course was found and is available to add.
 * - `not_found`: No course exists for the given unique number.
 * - `already_added`: The course was found but is already in the active schedule.
 * - `other_semester`: The course was found, but it's from a different semester than the courses in the active schedule.
 * - `unique_taken`: The course was found, but a course from another semester with the same unique number is already
 *   in the active schedule.
 */
export type CourseResult =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'found'; course: Course }
    | { status: 'not_found' }
    | { status: 'already_added' }
    | { status: 'other_semester'; course: Course; scheduleSemesters: Semester[] }
    | { status: 'unique_taken'; scheduledCourse: Course };

/** Compares semesters by season and year, since not every course has a semester code */
const isSameSemester = (a: Semester, b: Semester) => a.season === b.season && a.year === b.year;

const SEASON_ORDER: Record<Semester['season'], number> = { Spring: 0, Summer: 1, Fall: 2 };

/**
 * Defines the return type of the `useQuickAdd` hook, encapsulating all necessary state and logic for the Quick Add flow.
 *
 * This includes the semester dropdown state, the unique number input state, and the current course lookup result, allowing components to easily integrate the Quick Add functionality.
 */
export interface UseQuickAddReturn {
    /** Semester dropdown state, ready to spread into a Dropdown component. */
    semester: UseDropdownReturn<Semester>;
    /** Numeric input state for the unique course number. */
    uniqueNumber: ReturnType<typeof useNumericInput>;
    /** The current course lookup result. */
    courseResult: CourseResult;
}

/**
 * Encapsulates the main logic for the Quick Add flow:
 * semester selection, unique number input, and course lookup.
 *
 * @param isLoggedIn - The user's UT login status. The lookup is skipped while `false` and re-runs when it changes.
 *
 * @example
 * ```tsx
 * const { semester, uniqueNumber, courseResult } = useQuickAdd(isLoggedIn);
 * ```
 */
export function useQuickAdd(isLoggedIn?: boolean): UseQuickAddReturn {
    const [activeSchedule] = useSchedules();
    const uniqueNumber = useNumericInput('', UNIQUE_ID_LENGTH);
    const [availableSemesters, setAvailableSemesters] = useState<Semester[]>([]);
    const [courseResult, setCourseResult] = useState<CourseResult>({ status: 'idle' });

    // Semesters already in the schedule, oldest first
    const scheduleSemesters = useMemo(
        () =>
            activeSchedule.courses
                .map(course => course.semester)
                .filter((s, i, all) => all.findIndex(other => isSameSemester(other, s)) === i)
                .sort((a, b) => a.year - b.year || SEASON_ORDER[a.season] - SEASON_ORDER[b.season]),
        [activeSchedule]
    );

    const semester = useDropdown<Semester>({
        items: availableSemesters,
        // biome-ignore lint/style/noNonNullAssertion: TODO:
        getKey: s => s.code!,
        getLabel: s => `${s.season} ${s.year}`,
        defaultKey:
            availableSemesters.find(s => scheduleSemesters.some(other => isSameSemester(other, s)))?.code ??
            availableSemesters[0]?.code,
    });

    // Fetch available semesters on mount.
    useEffect(() => {
        fetchAvailableSemesters().then(setAvailableSemesters);
    }, []);

    // Look up the course whenever the unique number, semester, or login status changes.
    useEffect(() => {
        if (isLoggedIn === false || uniqueNumber.value.length !== UNIQUE_ID_LENGTH || !semester.selectedItem?.code) {
            setCourseResult({ status: 'idle' });
            return;
        }

        let cancelled = false;
        const courseUrl = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${semester.selectedItem.code}/${uniqueNumber.value}/`;

        setCourseResult({ status: 'loading' });

        getCourseByURL(courseUrl)
            .then(course => {
                if (cancelled) return;

                if (!course) {
                    setCourseResult({ status: 'not_found' });
                } else if (
                    // The same unique number can be a different course in another semester
                    activeSchedule.courses.some(
                        c => c.uniqueId === course.uniqueId && isSameSemester(c.semester, course.semester)
                    )
                ) {
                    setCourseResult({ status: 'already_added' });
                } else if (
                    scheduleSemesters.length > 0 &&
                    !scheduleSemesters.some(s => isSameSemester(s, course.semester))
                ) {
                    setCourseResult({ status: 'other_semester', course, scheduleSemesters });
                } else {
                    const scheduledCourse = activeSchedule.courses.find(c => c.uniqueId === course.uniqueId);
                    setCourseResult(
                        scheduledCourse ? { status: 'unique_taken', scheduledCourse } : { status: 'found', course }
                    );
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setCourseResult({ status: 'not_found' });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [uniqueNumber.value, semester.selectedItem?.code, activeSchedule, scheduleSemesters, isLoggedIn]);

    return {
        semester,
        uniqueNumber,
        courseResult,
    };
}
