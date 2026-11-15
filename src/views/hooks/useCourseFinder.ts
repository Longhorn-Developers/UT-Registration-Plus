import { fetchAvailableSemesters } from '@pages/background/lib/fetchAvailableSemesters';
import { background } from '@shared/messages';
import { CacheStore } from '@shared/storage/CacheStore';
import type { Course, Semester } from '@shared/types/Course';
import { FIELDS_OF_STUDY, type FieldOfStudy } from '@shared/types/FieldOfStudy';
import useCustomBlocks from '@views/hooks/useCustomBlocks';
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
 * Fetches pages of search results one after another, following each page's link to the next.
 *
 * @param urls - the pages to start from
 * @param onPage - called with each page as it arrives; returning false stops fetching
 * @param maxPages - the most pages to fetch
 * @returns the pages still left to load, or null if `onPage` stopped it
 */
async function fetchResultPages(
    urls: string[],
    onPage: (page: Awaited<ReturnType<typeof fetchCourseFinderPage>>) => boolean | Promise<boolean>,
    maxPages = MAX_PAGES_PER_LOAD
): Promise<string[] | null> {
    const remaining = [...urls];
    for (let i = 0; i < maxPages; i++) {
        const url = remaining.shift();
        if (!url) break;

        const page = await fetchCourseFinderPage(url);
        if (page.nextPageURL) {
            remaining.unshift(page.nextPageURL);
        }
        if (!(await onPage(page))) return null;
    }
    return remaining;
}

/**
 * Represents the state of the course search.
 *
 * - `idle`: There's no search, either because none has been made yet or because it was cleared.
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
    /** Whether UT's semesters are still being fetched, so none can be picked yet. */
    areSemestersLoading: boolean;
    /** The fields of study the user can search by. */
    fieldsOfStudy: readonly FieldOfStudy[];
    /** The current state of the search. */
    status: CourseFinderStatus;
    /** The query of the current search, or null when there's no search. */
    query: CourseFinderQuery | null;
    /** Starts a new search, replacing the current results. */
    search: (query: CourseFinderQuery) => Promise<void>;
    /** Loads the next pages of results for the current search. */
    loadMore: () => void;
    /** Clears the current search and its results. */
    reset: () => void;
    /**
     * Searches again for the current results, so their seats and statuses are up to date. The results stay shown (with
     * the same courses expanded and the same filters) until the new ones replace them. Only refreshes a search that
     * finished loading.
     */
    refresh: () => Promise<void>;
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
    /** The courses (by full name) whose sections are shown in the results. Courses start collapsed. */
    expandedGroups: ReadonlySet<string>;
    /** Expands or collapses a course's sections in the results. */
    toggleGroup: (fullName: string) => void;
}

/**
 * Encapsulates the main logic for the Course Finder:
 * semester selection, searching UT's course schedule page by page, and filtering the results.
 *
 * @param isOpen - Whether the Course Finder is shown. Its semester defaults to the one of the schedule that's active
 * when it's first shown.
 *
 * @example
 * ```tsx
 * const { semester, search, groups, filters, setFilters } = useCourseFinder(isOpen);
 * ```
 */
export function useCourseFinder(isOpen: boolean): UseCourseFinderReturn {
    const activeSchedule = useActiveSchedule();
    const blocks = useCustomBlocks(activeSchedule.id);
    // Null while they're being fetched
    const [availableSemesters, setAvailableSemesters] = useState<Semester[] | null>(null);
    const [fieldsOfStudy, setFieldsOfStudy] = useState<readonly FieldOfStudy[]>(FIELDS_OF_STUDY);
    const [status, setStatus] = useState<CourseFinderStatus>('idle');
    const [query, setQuery] = useState<CourseFinderQuery | null>(null);
    const [results, setResults] = useState<Course[]>([]);
    const [pendingURLs, setPendingURLs] = useState<string[]>([]);
    const [filters, setFilters] = useState<CourseFinderFilters>(DEFAULT_COURSE_FINDER_FILTERS);
    const [expandedGroups, setExpandedGroups] = useState<ReadonlySet<string>>(new Set());

    // Incremented on every search, load more, and refresh, so pages from an older one are dropped once they arrive
    const searchId = useRef(0);
    // Incremented on every new search only, which is what opens the cards of a course search again
    const searchCount = useRef(0);
    // How many pages of results are shown, so a refresh loads as many again
    const loadedPageCount = useRef(0);
    // The query and status as they're set, for refresh to read: it keeps the same identity so the calendar header can
    // hold it without re-rendering, and a search started just before it (and not rendered yet) has to stop it
    const latest = useRef<{ query: CourseFinderQuery | null; status: CourseFinderStatus }>({
        query: null,
        status: 'idle',
    });
    const updateStatus = useCallback((newStatus: CourseFinderStatus) => {
        latest.current.status = newStatus;
        setStatus(newStatus);
    }, []);

    // Default to the semester of the schedule the courses are being added to. It's picked once, the first time the
    // Course Finder is shown with the semesters loaded: worked out on every render, it would change whenever the
    // schedule's first course did, and the form would search the new semester on its own.
    const defaultSemesterCode = useRef<string | undefined>(undefined);
    const hasPickedDefaultSemester = useRef(false);
    if (!hasPickedDefaultSemester.current && isOpen && availableSemesters?.length) {
        hasPickedDefaultSemester.current = true;
        const scheduleSemesterCode = activeSchedule.courses.find(c => c.semester.code)?.semester.code;
        defaultSemesterCode.current =
            availableSemesters.find(s => s.code === scheduleSemesterCode)?.code ?? availableSemesters[0]?.code;
    }
    const semester = useDropdown<Semester>({
        items: availableSemesters ?? [],
        // biome-ignore lint/style/noNonNullAssertion: TODO:
        getKey: s => s.code!,
        getLabel: s => `${s.season} ${s.year}`,
        defaultKey: defaultSemesterCode.current,
    });

    // Fetch available semesters and the latest fields of study on mount.
    useEffect(() => {
        fetchAvailableSemesters()
            .then(setAvailableSemesters)
            .catch(error => {
                console.error('Failed to load the semesters', error);
                setAvailableSemesters([]);
            });
        // Without the cached list, the bundled one is still there to pick from
        CacheStore.get('fieldsOfStudy')
            .then(cached => {
                if (cached?.data.length) {
                    setFieldsOfStudy(cached.data);
                }
            })
            .catch(error => console.error('Failed to load the cached fields of study', error));

        return () => {
            // Stop any search in progress from updating state after unmounting
            searchId.current += 1;
        };
    }, []);

    const loadPages = useCallback(
        async (urls: string[], id: number) => {
            let refreshedFieldsOfStudy = false;
            updateStatus('loading');

            try {
                const remaining = await fetchResultPages(urls, async page => {
                    if (id !== searchId.current) return false;

                    loadedPageCount.current += 1;
                    setResults(prev => {
                        const loaded = new Set(prev.map(c => c.uniqueId));
                        return [...prev, ...page.courses.filter(c => !loaded.has(c.uniqueId))];
                    });

                    if (!refreshedFieldsOfStudy && page.fieldsOfStudy.length > 0) {
                        refreshedFieldsOfStudy = true;
                        setFieldsOfStudy(page.fieldsOfStudy);
                        await CacheStore.set('fieldsOfStudy', { data: page.fieldsOfStudy, dataFetched: Date.now() });
                    }
                    return true;
                });

                if (!remaining || id !== searchId.current) return;
                setPendingURLs(remaining);
                updateStatus('done');
            } catch (error) {
                console.error('Failed to search the course schedule', error);
                if (id !== searchId.current) return;
                setPendingURLs([]);
                updateStatus('error');
            }
        },
        [updateStatus]
    );

    const search = useCallback(
        async (newQuery: CourseFinderQuery) => {
            searchId.current += 1;
            searchCount.current += 1;
            loadedPageCount.current = 0;
            const id = searchId.current;

            latest.current.query = newQuery;
            setQuery(newQuery);
            setResults([]);
            setPendingURLs([]);
            setExpandedGroups(new Set());
            // Flags differ between searches, so a flag from the last search could hide every result
            setFilters(prev => ({ ...prev, flags: [] }));
            updateStatus('loading');

            const isLoggedIn = await background.validateLoginStatus();
            if (id !== searchId.current) return;
            if (!isLoggedIn) {
                updateStatus('logged_out');
                return;
            }

            await loadPages(getCourseFinderURLs(newQuery), id);
        },
        [loadPages, updateStatus]
    );

    // A search that found the user logged out runs again once they're back from logging in,
    // usually in the tab the "Log in to UT" link opens, which closes itself after logging in
    useEffect(() => {
        if (status !== 'logged_out' || !query) return undefined;

        const retry = async () => {
            if (document.visibilityState !== 'visible') return;
            if (await background.validateLoginStatus()) {
                void search(query);
            }
        };

        document.addEventListener('visibilitychange', retry);
        window.addEventListener('focus', retry);
        return () => {
            document.removeEventListener('visibilitychange', retry);
            window.removeEventListener('focus', retry);
        };
    }, [status, query, search]);

    const reset = useCallback(() => {
        searchId.current += 1;
        loadedPageCount.current = 0;
        latest.current.query = null;
        setQuery(null);
        setResults([]);
        setPendingURLs([]);
        setExpandedGroups(new Set());
        // Flags are only shown alongside results, so one left picked would be counted without being seen
        setFilters(prev => ({ ...prev, flags: [] }));
        updateStatus('idle');
    }, [updateStatus]);

    const refresh = useCallback(async () => {
        // A search that's loading is fresh already, and one that's logged out runs again by itself after logging in. One
        // that failed is tried again.
        const { query: currentQuery, status: currentStatus } = latest.current;
        if (!currentQuery || (currentStatus !== 'done' && currentStatus !== 'error')) return;

        searchId.current += 1;
        const id = searchId.current;

        const isLoggedIn = await background.validateLoginStatus();
        if (id !== searchId.current) return;
        if (!isLoggedIn) {
            updateStatus('logged_out');
            return;
        }

        // Collected before they're shown, so the results don't shrink to the first page while the rest reload
        const courses = new Map<number, Course>();
        let pageCount = 0;
        let remaining: string[] | null;
        try {
            remaining = await fetchResultPages(
                getCourseFinderURLs(currentQuery),
                page => {
                    if (id !== searchId.current) return false;
                    pageCount += 1;
                    for (const course of page.courses) {
                        if (!courses.has(course.uniqueId)) courses.set(course.uniqueId, course);
                    }
                    return true;
                },
                // As many pages as were shown, including ones loaded with "load more"
                Math.max(MAX_PAGES_PER_LOAD, loadedPageCount.current)
            );
        } catch (error) {
            // The results from before stay up
            console.error('Failed to refresh the course search', error);
            return;
        }

        if (!remaining || id !== searchId.current) return;
        loadedPageCount.current = pageCount;
        setResults([...courses.values()]);
        setPendingURLs(remaining);
        updateStatus('done');
    }, [updateStatus]);

    const loadMore = useCallback(() => {
        // A search started since the last render is loading already, and these would be its predecessor's pages
        if (latest.current.status === 'loading' || pendingURLs.length === 0) return;
        // Stops a refresh that's running, which would replace the pages this loads with the ones before them
        searchId.current += 1;
        void loadPages(pendingURLs, searchId.current);
    }, [pendingURLs, loadPages]);

    const filteredResults = useMemo(() => {
        // When searching by core, make sure every result actually satisfies that core area
        const effectiveFilters =
            query?.searchBy === 'core' ? { ...filters, coreCode: filters.coreCode ?? query.coreCode } : filters;
        return filterCourses(results, effectiveFilters, activeSchedule.courses, blocks);
    }, [results, filters, query, activeSchedule.courses, blocks]);

    const toggleGroup = useCallback((fullName: string) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            if (!next.delete(fullName)) next.add(fullName);
            return next;
        });
    }, []);

    const groups = useMemo(() => groupCourses(filteredResults), [filteredResults]);

    // A search for one course (i.e. "C S 314") shows its sections right away, rather than a card to open. Each card opens
    // once, when it first shows up in the search (a topics course can have cards on several pages), so a card closed
    // afterwards stays closed when the filters or schedule change, more pages load, or the results are refreshed. The
    // search is told apart by its count, since running the same query again (i.e. after logging in) is a new search.
    const autoExpanded = useRef<{ search: number; names: Set<string> }>({ search: -1, names: new Set() });
    useEffect(() => {
        if (query?.searchBy !== 'course') return;
        if (autoExpanded.current.search !== searchCount.current) {
            autoExpanded.current = { search: searchCount.current, names: new Set() };
        }
        const { names } = autoExpanded.current;
        const newNames = groups.map(group => group.fullName).filter(name => !names.has(name));
        if (newNames.length === 0) return;
        for (const name of newNames) names.add(name);
        setExpandedGroups(prev => new Set([...prev, ...newNames]));
    }, [query, groups]);

    const availableFlags = useMemo(() => [...new Set(results.flatMap(c => c.flags))].sort(), [results]);

    return {
        semester,
        areSemestersLoading: availableSemesters === null,
        fieldsOfStudy,
        status,
        query,
        search,
        loadMore,
        reset,
        refresh,
        hasMore: pendingURLs.length > 0,
        results,
        groups,
        matchCount: filteredResults.length,
        availableFlags,
        filters,
        setFilters,
        expandedGroups,
        toggleGroup,
    };
}
