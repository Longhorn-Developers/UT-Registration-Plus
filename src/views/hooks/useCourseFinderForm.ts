import type { FieldOfStudy } from '@shared/types/FieldOfStudy';
import type { DropdownOption } from '@views/components/common/Dropdown';
import { CourseLevel, type CourseLevelType } from '@views/lib/courseFinder';
import { useState } from 'react';

/**
 * The levels the Course Finder can search a field of study at
 */
export const LEVEL_OPTIONS = [
    { id: 'LU', label: 'Undergrad', levels: [CourseLevel.LOWER, CourseLevel.UPPER] },
    { id: 'L', label: 'Lower division', levels: [CourseLevel.LOWER] },
    { id: 'U', label: 'Upper division', levels: [CourseLevel.UPPER] },
    { id: 'G', label: 'Graduate', levels: [CourseLevel.GRADUATE] },
] as const satisfies (DropdownOption & { levels: CourseLevelType[] })[];

/**
 * The ID of one of the {@link LEVEL_OPTIONS}
 */
export type LevelOptionId = (typeof LEVEL_OPTIONS)[number]['id'];

/**
 * Defines the return type of the `useCourseFinderForm` hook.
 */
export interface UseCourseFinderFormReturn {
    /** The field of study to search. */
    department: FieldOfStudy | null;
    setDepartment: (department: FieldOfStudy | null) => void;
    /** What's typed in the field of study input, while looking for a field of study to pick. */
    fieldOfStudySearch: string;
    setFieldOfStudySearch: (search: string) => void;
    /** Which levels of the field of study to search. */
    levelId: LevelOptionId;
    setLevelId: (levelId: LevelOptionId) => void;
    /** Whether the filters are shown. They start hidden to keep the Course Finder simple. */
    areFiltersOpen: boolean;
    setAreFiltersOpen: (areFiltersOpen: boolean) => void;
}

/**
 * Holds what's entered in the Course Finder's search form. It lives outside the Course Finder, so the form is
 * still filled in (next to the results) after going back to the schedules and opening it again.
 */
export function useCourseFinderForm(): UseCourseFinderFormReturn {
    const [department, setDepartment] = useState<FieldOfStudy | null>(null);
    const [fieldOfStudySearch, setFieldOfStudySearch] = useState('');
    const [levelId, setLevelId] = useState<LevelOptionId>('LU');
    const [areFiltersOpen, setAreFiltersOpen] = useState(false);

    return {
        department,
        setDepartment,
        fieldOfStudySearch,
        setFieldOfStudySearch,
        levelId,
        setLevelId,
        areFiltersOpen,
        setAreFiltersOpen,
    };
}
