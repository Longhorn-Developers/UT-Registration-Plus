import { fetchAvailableSemesters } from '@pages/background/lib/fetchAvailableSemesters';
import { getCourseByURL } from '@pages/background/lib/getCourseByURL';
import { type Course, type Semester, UNIQUE_ID_LENGTH } from '@shared/types/Course';
import { useDropdown, type UseDropdownReturn } from '@views/hooks/useDropdown';
import { useNumericInput } from '@views/hooks/useNumericInput';
import useSchedules from '@views/hooks/useSchedules';
import { useEffect, useState } from 'react';

/**
 * Represents the state of the async course lookup.
 *
 * - `idle`: No lookup has been initiated (input is incomplete or empty).
 * - `loading`: A lookup is in progress.
 * - `found`: A course was found and is available to add.
 * - `not_found`: No course exists for the given unique number.
 * - `already_added`: The course was found but is already in the active schedule.
 */
export type CourseResult =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'found'; course: Course }
    | { status: 'not_found' }
    | { status: 'already_added' };

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
 * @example
 * ```tsx
 * const { semester, uniqueNumber, courseResult } = useQuickAdd();
 * ```
 */
export function useQuickAdd(): UseQuickAddReturn {
    const [activeSchedule] = useSchedules();
    const uniqueNumber = useNumericInput('', UNIQUE_ID_LENGTH);
    const [availableSemesters, setAvailableSemesters] = useState<Semester[]>([]);
    const [courseResult, setCourseResult] = useState<CourseResult>({ status: 'idle' });

    const semester = useDropdown<Semester>({
        items: availableSemesters,
        getKey: s => s.code!,
        getLabel: s => `${s.season} ${s.year}`,
        defaultKey: availableSemesters[0]?.code,
    });

    // Fetch available semesters on mount.
    useEffect(() => {
        fetchAvailableSemesters().then(setAvailableSemesters);
    }, []);

    // Look up the course whenever the unique number or semester changes.
    useEffect(() => {
        if (uniqueNumber.value.length !== UNIQUE_ID_LENGTH) {
            setCourseResult({ status: 'idle' });
            return;
        }

        let cancelled = false;
        const courseUrl = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${semester.selectedItem?.code}/${uniqueNumber.value}/`;

        setCourseResult({ status: 'loading' });

        getCourseByURL(courseUrl).then(course => {
            if (cancelled) return;

            if (!course) {
                setCourseResult({ status: 'not_found' });
            } else if (activeSchedule.containsCourse(course)) {
                setCourseResult({ status: 'already_added' });
            } else {
                setCourseResult({ status: 'found', course });
            }
        });

        return () => {
            cancelled = true;
        };
    }, [uniqueNumber.value, semester.selectedItem?.code, activeSchedule]);

    return {
        semester,
        uniqueNumber,
        courseResult,
    };
}
