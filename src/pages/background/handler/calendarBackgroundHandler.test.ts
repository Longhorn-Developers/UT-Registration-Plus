import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import calendarBackgroundHandler from './calendarBackgroundHandler';

vi.mock('@shared/storage/OptionsStore', () => ({
    OptionsStore: { get: () => Promise.resolve(false) },
}));

const openCoursePopup = vi.hoisted(() => vi.fn());
vi.mock('@shared/messages', () => ({ tabs: { openCoursePopup } }));

const EXTENSION = 'chrome-extension://abcdefghijklmnop';
const CALENDAR_URL = `${EXTENSION}/calendar.html`;

type Context = { tabId: number; windowId: number; documentUrl?: string };

let contexts: Context[];
let discardedTabIds: Set<number>;
let session: Record<string, unknown>;
// How long each read of the session storage takes, in order, so tests can make two changes overlap
let sessionReadDelays: number[];
let tabsCreate: ReturnType<typeof vi.fn>;
let tabsUpdate: ReturnType<typeof vi.fn>;

// What tabs report without the "tabs" permission: no URL, even for the extension's own pages
const tab = (id: number, windowId = 1) => ({ id, windowId, index: 0 }) as chrome.tabs.Tab;

type HandlerArgs<K extends keyof typeof calendarBackgroundHandler> = Parameters<
    (typeof calendarBackgroundHandler)[K]
>[0];

/** The calendar page telling the background it's open in the given tab */
const registerCalendarTab = (tabId: number) =>
    new Promise(resolve => {
        calendarBackgroundHandler.registerCalendarTab({
            data: undefined,
            sender: { tab: tab(tabId) },
            sendResponse: resolve,
        } as unknown as HandlerArgs<'registerCalendarTab'>);
    });

/** The calendar page in the given tab telling the background it's being left */
const unregisterCalendarTab = (tabId: number) =>
    new Promise(resolve => {
        calendarBackgroundHandler.unregisterCalendarTab({
            data: undefined,
            sender: { tab: tab(tabId) },
            sendResponse: resolve,
        } as unknown as HandlerArgs<'unregisterCalendarTab'>);
    });

/** Clicks the Calendar button in the popup, or a course's calendar button when given its unique number */
const switchToCalendarTab = (uniqueId?: number) =>
    new Promise(resolve => {
        calendarBackgroundHandler.switchToCalendarTab({
            data: { uniqueId },
            sender: {},
            sendResponse: resolve,
        } as unknown as HandlerArgs<'switchToCalendarTab'>);
    });

beforeEach(() => {
    contexts = [];
    discardedTabIds = new Set();
    openCoursePopup.mockReset().mockResolvedValue(undefined);
    session = {};
    sessionReadDelays = [];
    tabsCreate = vi.fn(() => Promise.resolve(tab(99)));
    tabsUpdate = vi.fn((tabId: number) => Promise.resolve(tab(tabId)));
    vi.stubGlobal('chrome', {
        runtime: {
            ContextType: { TAB: 'TAB' },
            getURL: (path: string) => `${EXTENSION}${path}`,
            getContexts: vi.fn(() => Promise.resolve(contexts)),
        },
        storage: {
            session: {
                get: async (key: string) => {
                    await new Promise(resolve => setTimeout(resolve, sessionReadDelays.shift() ?? 0));
                    return { [key]: structuredClone(session[key]) };
                },
                set: (items: Record<string, unknown>) => {
                    Object.assign(session, structuredClone(items));
                    return Promise.resolve();
                },
            },
        },
        tabs: {
            get: (tabId: number) => Promise.resolve({ ...tab(tabId), discarded: discardedTabIds.has(tabId) }),
            update: tabsUpdate,
            create: tabsCreate,
        },
        windows: {
            get: () => Promise.resolve({ state: 'normal' }),
            update: () => Promise.resolve({}),
        },
    });
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('switchToCalendarTab', () => {
    it('switches to the calendar tab that is open instead of opening another', async () => {
        contexts = [{ tabId: 5, windowId: 1, documentUrl: `${CALENDAR_URL}?uniqueId=12345` }];
        await registerCalendarTab(5);

        await switchToCalendarTab();
        expect(tabsUpdate).toHaveBeenCalledWith(5, { active: true });
        expect(tabsCreate).not.toHaveBeenCalled();
    });

    it('switches to a calendar tab Chrome discarded to save memory, which has no page to check', async () => {
        await registerCalendarTab(5);
        discardedTabIds.add(5);

        await switchToCalendarTab();
        expect(tabsUpdate).toHaveBeenCalledWith(5, { active: true });
        expect(tabsCreate).not.toHaveBeenCalled();
    });

    it('switches to the calendar tab it just opened, before the calendar in it has loaded', async () => {
        // A double-click on a button that opens the calendar
        await switchToCalendarTab();
        await switchToCalendarTab();
        expect(tabsCreate).toHaveBeenCalledTimes(1);
        expect(tabsUpdate).toHaveBeenCalledWith(99, { active: true });
    });

    it("opens the course in a calendar tab that can't take messages yet by loading it with the course", async () => {
        await registerCalendarTab(5);
        discardedTabIds.add(5);

        await switchToCalendarTab(12345);
        expect(tabsUpdate).toHaveBeenCalledWith(5, { url: `${CALENDAR_URL}?uniqueId=12345` });
        expect(openCoursePopup).not.toHaveBeenCalled();

        // While it loads (no longer discarded, and not a calendar page yet), the Calendar button still switches to it
        discardedTabIds.delete(5);
        tabsCreate.mockClear();
        await switchToCalendarTab();
        expect(tabsCreate).not.toHaveBeenCalled();
    });

    it('opens the course in a calendar tab that is loaded with a message', async () => {
        contexts = [{ tabId: 5, windowId: 1, documentUrl: CALENDAR_URL }];
        await registerCalendarTab(5);

        await switchToCalendarTab(12345);
        expect(openCoursePopup).toHaveBeenCalledWith({ uniqueId: 12345 }, { tabId: 5 });
        expect(tabsUpdate).not.toHaveBeenCalledWith(5, expect.objectContaining({ url: expect.anything() }));
    });

    it('opens a new calendar after its tab left the calendar, even once Chrome has discarded that tab', async () => {
        await registerCalendarTab(5);
        // The calendar page tells the background when it's left
        await unregisterCalendarTab(5);
        discardedTabIds.add(5);

        await switchToCalendarTab(12345);
        expect(tabsUpdate).not.toHaveBeenCalled();
        expect(tabsCreate).toHaveBeenCalledWith(expect.objectContaining({ url: `${CALENDAR_URL}?uniqueId=12345` }));
    });

    it("still opens a calendar when Chrome can't list the extension's pages", async () => {
        await registerCalendarTab(5);
        vi.mocked(chrome.runtime.getContexts).mockRejectedValue(new Error('getContexts is not a function'));
        vi.spyOn(console, 'error').mockImplementation(() => {});

        await switchToCalendarTab();
        expect(tabsCreate).toHaveBeenCalledWith(expect.objectContaining({ url: CALENDAR_URL }));
    });

    it('keeps a reloaded calendar tracked when its unregister and register overlap', async () => {
        contexts = [{ tabId: 5, windowId: 1, documentUrl: CALENDAR_URL }];
        await registerCalendarTab(5);

        // The old page's unregister reads the state slower than the new page's register does
        sessionReadDelays = [20, 0];
        await Promise.all([unregisterCalendarTab(5), registerCalendarTab(5)]);

        await switchToCalendarTab();
        expect(tabsUpdate).toHaveBeenCalledWith(5, { active: true });
        expect(tabsCreate).not.toHaveBeenCalled();
    });

    it('opens a new calendar when its tab has gone to another page', async () => {
        contexts = [{ tabId: 5, windowId: 1, documentUrl: `${EXTENSION}/options.html` }];
        await registerCalendarTab(5);

        await switchToCalendarTab();
        expect(tabsUpdate).not.toHaveBeenCalled();
        expect(tabsCreate).toHaveBeenCalledWith(expect.objectContaining({ url: CALENDAR_URL }));
    });
});
