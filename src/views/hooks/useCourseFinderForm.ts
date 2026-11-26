import type { FieldOfStudy } from '@shared/types/FieldOfStudy';
import { CourseLevel, type CourseLevelType } from '@views/lib/courseFinder';
import { useState } from 'react';

/**
 * The levels the Course Finder can search a field of study at, in the order they're shown
 */
export const LEVEL_CHOICES = [
    { level: CourseLevel.LOWER, label: 'Lower', description: 'Lower division' },
    { level: CourseLevel.UPPER, label: 'Upper', description: 'Upper division' },
    { level: CourseLevel.GRADUATE, label: 'Grad', description: 'Graduate' },
] as const satisfies { level: CourseLevelType; label: string; description: string }[];

/**
 * The levels a field of study is searched at until others are picked: every undergraduate course
 */
export const DEFAULT_LEVELS: readonly CourseLevelType[] = [CourseLevel.LOWER, CourseLevel.UPPER];

/**
 * Puts levels in the order they're shown (and searched), so the same levels always make the same search
 */
export const sortLevels = (levels: readonly CourseLevelType[]): CourseLevelType[] =>
    LEVEL_CHOICES.map(choice => choice.level).filter(level => levels.includes(level));

/**
 * Defines the return type of the `useCourseFinderForm` hook.
 */
export interface UseCourseFinderFormReturn {
    /** The field of study to search. */
    department: FieldOfStudy | null;
    setDepartment: (department: FieldOfStudy | null) => void;
    /** The course number to search within the field of study, when a course code like "C S 314" was picked. */
    courseNumber: string | null;
    setCourseNumber: (courseNumber: string | null) => void;
    /** What's typed in the field of study input, while looking for a field of study to pick. */
    fieldOfStudySearch: string;
    setFieldOfStudySearch: (search: string) => void;
    /** Which levels of the field of study to search. Never empty. */
    levels: readonly CourseLevelType[];
    setLevels: (levels: readonly CourseLevelType[]) => void;
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
    const [courseNumber, setCourseNumber] = useState<string | null>(null);
    const [fieldOfStudySearch, setFieldOfStudySearch] = useState('');
    const [levels, setLevels] = useState<readonly CourseLevelType[]>(DEFAULT_LEVELS);
    const [areFiltersOpen, setAreFiltersOpen] = useState(false);

    return {
        department,
        setDepartment,
        courseNumber,
        setCourseNumber,
        fieldOfStudySearch,
        setFieldOfStudySearch,
        levels,
        setLevels,
        areFiltersOpen,
        setAreFiltersOpen,
    };
}
