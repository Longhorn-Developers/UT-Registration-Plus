import { fetchAvailableSemesters } from '@pages/background/lib/fetchAvailableSemesters';
import { background } from '@shared/messages';
import { CacheStore } from '@shared/storage/CacheStore';
import type { Course, Semester } from '@shared/types/Course';
import { FIELDS_OF_STUDY, type FieldOfStudy } from '@shared/types/FieldOfStudy';
import { type UseDropdownReturn, useDropdown } from '@views/hooks/useDropdown';
import { useActiveSchedule } from '@views/hooks/useSchedules';
import {
    type CourseFinderFilters,
    type CourseFinderGroup,
    type CourseFinderQuery,
    DEFAULT_COURSE_FINDER_FILTERS,
    fetchCourseFinderPage,
    filterCourses,
    getCourseFinderURLs,
    groupCourses,
} from '@views/lib/courseFinder';
import { type Dispatch, type SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * The most pages of results to load for a search (and per "load more") before stopping to ask for more.
 * Searches load every page by default, so the filters cover all of the results, but a huge search shouldn't
 * flood UT with requests.
 */
const MAX_PAGES_PER_LOAD = 30;

/**
 * Represents the state of the course search.
 *
 * - `idle`: No search has been made yet.
 * - `loading`: Pages of results are being fetched.
 * - `done`: The search finished (there may still be more pages to load).
 * - `logged_out`: The user has to log in to UT before searching the course schedule.
 * - `error`: Something went wrong while fetching or reading the results.
 */
export type CourseFinderStatus = 'idle' | 'loading' | 'done' | 'logged_out' | 'error';

/**
 * Defines the return type of the `useCourseFinder` hook, with everything the Course Finder needs to search and filter courses.
 */
export interface UseCourseFinderReturn {
    /** Semester dropdown state, ready to spread into a Dropdown component. */
    semester: UseDropdownReturn<Semester>;
    /** The fields of study the user can search by. */
    fieldsOfStudy: readonly FieldOfStudy[];
    /** The current state of the search. */
    status: CourseFinderStatus;
    /** The query of the latest search, or null before the first search. */
    query: CourseFinderQuery | null;
    /** Starts a new search, replacing the current results. */
    search: (query: CourseFinderQuery) => Promise<void>;
    /** Loads the next pages of results for the current search. */
    loadMore: () => void;
    /** Whether the current search has more pages of results to load. */
    hasMore: boolean;
    /** Every course section loaded for the current search. */
    results: Course[];
    /** The course sections that match the filters, grouped by course. */
    groups: CourseFinderGroup[];
    /** How many course sections match the filters. */
    matchCount: number;
    /** The flags that at least one loaded course has, so only useful flag filters are shown. */
    availableFlags: string[];
    /** The filters applied to the results. */
    filters: CourseFinderFilters;
    /** Updates the filters applied to the results. */
    setFilters: Dispatch<SetStateAction<CourseFinderFilters>>;
    /** The courses (by full name) whose sections are collapsed in the results. */
    collapsedGroups: ReadonlySet<string>;
    /** Collapses or expands a course's sections in the results. */
    toggleGroup: (fullName: string) => void;
}

/**
 * Encapsulates the main logic for the Course Finder:
 * semester selection, searching UT's course schedule page by page, and filtering the results.
 *
 * @example
 * ```tsx
 * const { semester, search, groups, filters, setFilters } = useCourseFinder();
 * ```
 */
export function useCourseFinder(): UseCourseFinderReturn {
    const activeSchedule = useActiveSchedule();
    const [availableSemesters, setAvailableSemesters] = useState<Semester[]>([]);
    const [fieldsOfStudy, setFieldsOfStudy] = useState<readonly FieldOfStudy[]>(FIELDS_OF_STUDY);
    const [status, setStatus] = useState<CourseFinderStatus>('idle');
    const [query, setQuery] = useState<CourseFinderQuery | null>(null);
    const [results, setResults] = useState<Course[]>([]);
    const [pendingURLs, setPendingURLs] = useState<string[]>([]);
    const [filters, setFilters] = useState<CourseFinderFilters>(DEFAULT_COURSE_FINDER_FILTERS);
    const [collapsedGroups, setCollapsedGroups] = useState<ReadonlySet<string>>(new Set());

    // Incremented on every search, so pages from an older search are dropped once they arrive
    const searchId = useRef(0);

    // Default to the semester of the schedule the courses are being added to
    const scheduleSemesterCode = activeSchedule.courses.find(c => c.semester.code)?.semester.code;
    const semester = useDropdown<Semester>({
        items: availableSemesters,
        // biome-ignore lint/style/noNonNullAssertion: TODO:
        getKey: s => s.code!,
        getLabel: s => `${s.season} ${s.year}`,
        defaultKey: availableSemesters.find(s => s.code === scheduleSemesterCode)?.code ?? availableSemesters[0]?.code,
    });

    // Fetch available semesters and the latest fields of study on mount.
    useEffect(() => {
        fetchAvailableSemesters().then(setAvailableSemesters);
        CacheStore.get('fieldsOfStudy').then(cached => {
            if (cached?.data.length) {
                setFieldsOfStudy(cached.data);
            }
        });

        return () => {
            // Stop any search in progress from updating state after unmounting
            searchId.current += 1;
        };
    }, []);

    const loadPages = useCallback(async (urls: string[], id: number) => {
        const remaining = [...urls];
        let refreshedFieldsOfStudy = false;
        setStatus('loading');

        try {
            for (let i = 0; i < MAX_PAGES_PER_LOAD; i++) {
                const url = remaining.shift();
                if (!url) break;

                const page = await fetchCourseFinderPage(url);
                if (id !== searchId.current) return;

                if (page.nextPageURL) {
                    remaining.unshift(page.nextPageURL);
                }

                setResults(prev => {
                    const loaded = new Set(prev.map(c => c.uniqueId));
                    return [...prev, ...page.courses.filter(c => !loaded.has(c.uniqueId))];
                });

                if (!refreshedFieldsOfStudy && page.fieldsOfStudy.length > 0) {
                    refreshedFieldsOfStudy = true;
                    setFieldsOfStudy(page.fieldsOfStudy);
                    await CacheStore.set('fieldsOfStudy', { data: page.fieldsOfStudy, dataFetched: Date.now() });
                }
            }

            if (id !== searchId.current) return;
            setPendingURLs(remaining);
            setStatus('done');
        } catch (error) {
            console.error('Failed to search the course schedule', error);
            if (id !== searchId.current) return;
            setPendingURLs([]);
            setStatus('error');
        }
    }, []);

    const search = useCallback(
        async (newQuery: CourseFinderQuery) => {
            searchId.current += 1;
            const id = searchId.current;

            setQuery(newQuery);
            setResults([]);
            setPendingURLs([]);
            setCollapsedGroups(new Set());
            // Flags differ between searches, so a flag from the last search could hide every result
            setFilters(prev => ({ ...prev, flags: [] }));
            setStatus('loading');

            const isLoggedIn = await background.validateLoginStatus();
            if (id !== searchId.current) return;
            if (!isLoggedIn) {
                setStatus('logged_out');
                return;
            }

            await loadPages(getCourseFinderURLs(newQuery), id);
        },
        [loadPages]
    );

    const loadMore = useCallback(() => {
        if (status === 'loading' || pendingURLs.length === 0) return;
        void loadPages(pendingURLs, searchId.current);
    }, [status, pendingURLs, loadPages]);

    const filteredResults = useMemo(() => {
        // When searching by core, make sure every result actually satisfies that core area
        const effectiveFilters =
            query?.searchBy === 'core' ? { ...filters, coreCode: filters.coreCode ?? query.coreCode } : filters;
        return filterCourses(results, effectiveFilters, activeSchedule.courses);
    }, [results, filters, query, activeSchedule.courses]);

    const toggleGroup = useCallback((fullName: string) => {
        setCollapsedGroups(prev => {
            const next = new Set(prev);
            if (!next.delete(fullName)) next.add(fullName);
            return next;
        });
    }, []);

    const groups = useMemo(() => groupCourses(filteredResults), [filteredResults]);

    const availableFlags = useMemo(() => [...new Set(results.flatMap(c => c.flags))].sort(), [results]);

    return {
        semester,
        fieldsOfStudy,
        status,
        query,
        search,
        loadMore,
        hasMore: pendingURLs.length > 0,
        results,
        groups,
        matchCount: filteredResults.length,
        availableFlags,
        filters,
        setFilters,
        collapsedGroups,
        toggleGroup,
    };
}
