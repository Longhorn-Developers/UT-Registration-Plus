import type { Course } from '@shared/types/Course';
import type { CourseFinderPage, CourseFinderQuery } from '@views/lib/courseFinder';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type UseCourseFinderReturn, useCourseFinder } from '../useCourseFinder';

// Lets React know updates in these tests are wrapped in act()
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
    isLoggedIn: true,
    // Each page fetched waits here until the test answers it
    pageRequests: [] as Array<{ url: string; resolve: (page: unknown) => void; reject: (error: Error) => void }>,
}));

vi.mock('@pages/background/lib/fetchAvailableSemesters', () => ({
    fetchAvailableSemesters: () => Promise.resolve([{ year: 2026, season: 'Fall', code: '20269' }]),
}));

vi.mock('@shared/messages', () => ({
    background: { validateLoginStatus: () => Promise.resolve(mocks.isLoggedIn) },
}));

vi.mock('@shared/storage/CacheStore', () => ({
    CacheStore: { get: () => Promise.resolve(undefined), set: () => Promise.resolve() },
}));

vi.mock('@views/hooks/useSchedules', () => {
    const schedule = { id: 'schedule', courses: [] };
    return { useActiveSchedule: () => schedule };
});

vi.mock('@views/hooks/useCustomBlocks', () => {
    const blocks: unknown[] = [];
    return { default: () => blocks };
});

vi.mock('@views/lib/courseFinder', async importOriginal => ({
    ...(await importOriginal<typeof import('@views/lib/courseFinder')>()),
    // Each field of study's search starts on a page of its own
    getCourseFinderURLs: (query: { department?: string }) => [query.department === 'M' ? 'M-page-1' : 'page-1'],
    fetchCourseFinderPage: (url: string) =>
        new Promise((resolve, reject) => {
            mocks.pageRequests.push({ url, resolve, reject });
        }),
}));

const QUERY: CourseFinderQuery = { searchBy: 'major', semesterCode: '20269', department: 'C S', levels: [] };
const COURSE_QUERY: CourseFinderQuery = {
    searchBy: 'course',
    semesterCode: '20269',
    department: 'C S',
    courseNumber: '314',
};

const section = (uniqueId: number, fullName: string, status: string) =>
    ({ uniqueId, fullName, status, flags: [], creditHours: 3 }) as unknown as Course;

const page = (courses: Course[], nextPageURL?: string): CourseFinderPage => ({
    courses,
    fieldsOfStudy: [],
    nextPageURL,
});

let finder: UseCourseFinderReturn;
let container: HTMLDivElement;
let root: Root;

function Harness() {
    finder = useCourseFinder(true);
    return null;
}

/** Lets the pending promises (login checks, state updates) settle */
const settle = () => act(async () => {});

/** Answers the oldest page request that's waiting */
const answerPage = async (result: CourseFinderPage | Error) => {
    const request = mocks.pageRequests.shift();
    if (!request) throw new Error('No page was requested');
    await act(async () => (result instanceof Error ? request.reject(result) : request.resolve(result)));
};

const shown = () => finder.results.map(c => `${c.uniqueId} ${c.status}`);

/** Searches, answering with two pages of results, and expands the first course */
const searchTwoPages = async () => {
    await act(async () => void finder.search(QUERY));
    await answerPage(page([section(1, 'C S 314', 'OPEN'), section(2, 'C S 314', 'OPEN')], 'page-2'));
    await answerPage(page([section(3, 'C S 429', 'OPEN')]));
    act(() => finder.toggleGroup('C S 314'));
};

beforeEach(async () => {
    mocks.isLoggedIn = true;
    mocks.pageRequests = [];
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    await act(async () => root.render(<Harness />));
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
});

describe('useCourseFinder refresh', () => {
    it('updates the seats of the results, keeping the expanded courses and filters', async () => {
        await searchTwoPages();
        act(() => finder.setFilters(prev => ({ ...prev, openOnly: true })));

        await act(async () => void finder.refresh());
        await answerPage(page([section(1, 'C S 314', 'WAITLISTED'), section(2, 'C S 314', 'OPEN')], 'page-2'));
        await answerPage(page([section(3, 'C S 429', 'CLOSED')]));

        expect(shown()).toEqual(['1 WAITLISTED', '2 OPEN', '3 CLOSED']);
        expect(finder.status).toBe('done');
        expect([...finder.expandedGroups]).toEqual(['C S 314']);
        expect(finder.filters.openOnly).toBe(true);
    });

    it("keeps every result up until the refreshed ones are in, rather than just the first page's", async () => {
        await searchTwoPages();

        await act(async () => void finder.refresh());
        await answerPage(page([section(1, 'C S 314', 'CLOSED')], 'page-2'));
        expect(shown()).toEqual(['1 OPEN', '2 OPEN', '3 OPEN']);
        expect(finder.status).toBe('done');
    });

    it('keeps the results it had when the refresh fails', async () => {
        await searchTwoPages();
        vi.spyOn(console, 'error').mockImplementation(() => {});

        await act(async () => void finder.refresh());
        await answerPage(new Error('Timed out'));

        expect(shown()).toEqual(['1 OPEN', '2 OPEN', '3 OPEN']);
        expect(finder.status).toBe('done');
    });

    it("drops a refresh's pages once a new search starts", async () => {
        await searchTwoPages();

        await act(async () => void finder.refresh());
        await act(async () => void finder.search({ ...QUERY, department: 'M' }));
        // The refresh's page arrives after the new search started
        await answerPage(page([section(1, 'C S 314', 'CLOSED')]));
        await answerPage(page([section(7, 'M 408D', 'OPEN')]));

        expect(shown()).toEqual(['7 OPEN']);
    });

    it('asks to log in when the refresh finds the user logged out', async () => {
        await searchTwoPages();
        mocks.isLoggedIn = false;

        await act(async () => void finder.refresh());
        await settle();

        expect(finder.status).toBe('logged_out');
        expect(mocks.pageRequests).toEqual([]);
    });

    it('does nothing without a search', async () => {
        await act(async () => void finder.refresh());
        await settle();

        expect(mocks.pageRequests).toEqual([]);
        expect(finder.status).toBe('idle');
    });

    it("doesn't refresh a search that's still loading", async () => {
        await act(async () => void finder.search(QUERY));
        await act(async () => void finder.refresh());

        expect(mocks.pageRequests.map(request => request.url)).toEqual(['page-1']);
    });

    it("doesn't refresh a search that found the user logged out, which runs again by itself", async () => {
        mocks.isLoggedIn = false;
        await act(async () => void finder.search(QUERY));
        expect(finder.status).toBe('logged_out');

        // Back from logging in: the search's own retry runs it again, so a refresh at the same time would cancel it
        mocks.isLoggedIn = true;
        await act(async () => void finder.refresh());
        await settle();
        expect(mocks.pageRequests).toEqual([]);
        expect(finder.status).toBe('logged_out');
    });

    it('leaves the cards of a course search as the user left them when refreshed', async () => {
        await act(async () => void finder.search(COURSE_QUERY));
        await answerPage(page([section(1, 'C S 314', 'OPEN')]));
        // A course search opens its cards, and this one was closed
        expect([...finder.expandedGroups]).toEqual(['C S 314']);
        act(() => finder.toggleGroup('C S 314'));

        await act(async () => void finder.refresh());
        await answerPage(page([section(1, 'C S 314', 'CLOSED')]));
        expect(shown()).toEqual(['1 CLOSED']);
        expect([...finder.expandedGroups]).toEqual([]);
    });

    it('leaves the cards of a course search as the user left them when more pages load', async () => {
        await act(async () => void finder.search(COURSE_QUERY));
        for (let i = 1; i <= 30; i++) {
            await answerPage(page([section(i, 'C S 314', 'OPEN')], `page-${i + 1}`));
        }
        act(() => finder.toggleGroup('C S 314'));

        act(() => finder.loadMore());
        await answerPage(page([section(31, 'C S 314', 'OPEN')]));
        expect(finder.results).toHaveLength(31);
        expect([...finder.expandedGroups]).toEqual([]);
    });

    it('refreshes every page that was loaded, past the most one search loads', async () => {
        await act(async () => void finder.search(QUERY));
        for (let i = 1; i <= 30; i++) {
            await answerPage(page([section(i, `C S ${i}`, 'OPEN')], `page-${i + 1}`));
        }
        expect(finder.hasMore).toBe(true);
        act(() => finder.loadMore());
        await answerPage(page([section(31, 'C S 31', 'OPEN')]));
        expect(finder.results).toHaveLength(31);

        await act(async () => void finder.refresh());
        // UT has added a 32nd page since, which stays for "load more" like before
        for (let i = 1; i <= 31; i++) {
            await answerPage(page([section(i, `C S ${i}`, 'CLOSED')], `page-${i + 1}`));
        }
        expect(mocks.pageRequests).toEqual([]);
        expect(finder.results).toHaveLength(31);
        expect(finder.results.every(c => c.status === 'CLOSED')).toBe(true);
        expect(finder.hasMore).toBe(true);
    });

    it('loads as many pages on the next refresh as the last refresh found', async () => {
        await act(async () => void finder.search(QUERY));
        for (let i = 1; i <= 30; i++) {
            await answerPage(page([section(i, `C S ${i}`, 'OPEN')], `page-${i + 1}`));
        }
        act(() => finder.loadMore());
        await answerPage(page([section(31, 'C S 31', 'OPEN')]));

        // UT has 2 pages left this time
        await act(async () => void finder.refresh());
        await answerPage(page([section(1, 'C S 1', 'OPEN')], 'page-2'));
        await answerPage(page([section(2, 'C S 2', 'OPEN')]));
        expect(finder.results).toHaveLength(2);

        // And many again: the shown 2 pages are fewer than one search loads, so it stops at 30
        await act(async () => void finder.refresh());
        for (let i = 1; i <= 30; i++) {
            await answerPage(page([section(i, `C S ${i}`, 'OPEN')], `page-${i + 1}`));
        }
        expect(mocks.pageRequests).toEqual([]);
        expect(finder.results).toHaveLength(30);
    });

    it("doesn't stop a search that started just before it, before the search was shown", async () => {
        await searchTwoPages();

        // Both in the same task, so the new search hasn't rendered when the refresh runs
        await act(async () => {
            void finder.search({ ...QUERY, department: 'M' });
            void finder.refresh();
        });
        expect(mocks.pageRequests.map(request => request.url)).toEqual(['M-page-1']);
        await answerPage(page([section(7, 'M 408D', 'OPEN')]));

        expect(shown()).toEqual(['7 OPEN']);
        expect(finder.status).toBe('done');
    });

    it("doesn't load more of the last search into a search that started just before it", async () => {
        await act(async () => void finder.search(QUERY));
        for (let i = 1; i <= 30; i++) {
            await answerPage(page([section(i, `C S ${i}`, 'OPEN')], `page-${i + 1}`));
        }
        expect(finder.hasMore).toBe(true);

        await act(async () => {
            void finder.search({ ...QUERY, department: 'M' });
            finder.loadMore();
        });
        expect(mocks.pageRequests.map(request => request.url)).toEqual(['M-page-1']);
    });

    it('tries a search that failed again', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        await act(async () => void finder.search(QUERY));
        await answerPage(new Error('Timed out'));
        expect(finder.status).toBe('error');

        await act(async () => void finder.refresh());
        await answerPage(page([section(1, 'C S 314', 'OPEN')]));
        expect(shown()).toEqual(['1 OPEN']);
        expect(finder.status).toBe('done');
    });
});
