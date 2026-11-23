import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import tabManagementHandler, { findExtensionPageTab } from './tabManagementHandler';

vi.mock('webextension-polyfill', () => ({
    default: {
        get runtime() {
            return chrome.runtime;
        },
        get tabs() {
            return chrome.tabs;
        },
        get windows() {
            return chrome.windows;
        },
    },
}));

const EXTENSION = 'chrome-extension://abcdefghijklmnop';
const SETTINGS_URL = `${EXTENSION}/options.html`;

type Context = { tabId: number; windowId: number; documentUrl?: string };

let contexts: Context[];
let tabsUpdate: ReturnType<typeof vi.fn>;
let tabsCreate: ReturnType<typeof vi.fn>;
let windowsUpdate: ReturnType<typeof vi.fn>;

const tab = (id: number, windowId: number) => ({ id, windowId }) as chrome.tabs.Tab;

/** Clicks the settings button from a tab, or from the popup when there's no tab */
const switchToSettings = (sender: { tab?: chrome.tabs.Tab }) =>
    new Promise(resolve => {
        tabManagementHandler.switchToSettingsTab({
            data: undefined,
            sender: sender as chrome.runtime.MessageSender,
            sendResponse: resolve,
        } as Parameters<typeof tabManagementHandler.switchToSettingsTab>[0]);
    });

beforeEach(() => {
    contexts = [];
    tabsUpdate = vi.fn((tabId: number) => Promise.resolve(tab(tabId, 1)));
    tabsCreate = vi.fn((options: { windowId?: number }) => Promise.resolve(tab(99, options.windowId ?? 1)));
    windowsUpdate = vi.fn(() => Promise.resolve({}));
    vi.stubGlobal('chrome', {
        runtime: {
            ContextType: { TAB: 'TAB' },
            getURL: (path: string) => `${EXTENSION}${path}`,
            getContexts: vi.fn(() => Promise.resolve(contexts)),
        },
        tabs: { update: tabsUpdate, create: tabsCreate, query: vi.fn(() => Promise.resolve([])) },
        // The popup's window
        windows: { update: windowsUpdate, getLastFocused: () => Promise.resolve({ id: 2 }) },
    });
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('findExtensionPageTab', () => {
    it('finds the settings tab without the Chrome-only contexts API', async () => {
        vi.stubGlobal('chrome', {
            ...chrome,
            runtime: { ...chrome.runtime, getContexts: undefined },
        });
        vi.mocked(chrome.tabs.query).mockImplementation(() =>
            Promise.resolve([
                { ...tab(4, 1), url: `${SETTINGS_URL}#credits` },
                { ...tab(7, 2), url: SETTINGS_URL },
                { ...tab(8, 2), url: `${SETTINGS_URL}.bak` },
            ])
        );

        expect(await findExtensionPageTab(SETTINGS_URL, 2)).toEqual({ tabId: 7, windowId: 2 });
    });

    it('finds the page with a query or hash on its URL, and not other pages', async () => {
        contexts = [
            { tabId: 3, windowId: 1, documentUrl: `${EXTENSION}/calendar.html` },
            { tabId: 4, windowId: 1, documentUrl: `${SETTINGS_URL}#credits` },
        ];
        expect(await findExtensionPageTab(SETTINGS_URL)).toEqual({ tabId: 4, windowId: 1 });
    });

    it('prefers the page open in the given window', async () => {
        contexts = [
            { tabId: 4, windowId: 1, documentUrl: SETTINGS_URL },
            { tabId: 7, windowId: 2, documentUrl: SETTINGS_URL },
        ];
        expect(await findExtensionPageTab(SETTINGS_URL, 2)).toEqual({ tabId: 7, windowId: 2 });
    });

    it("doesn't take a page whose name only starts the same", async () => {
        contexts = [{ tabId: 4, windowId: 1, documentUrl: `${EXTENSION}/options.html.bak` }];
        expect(await findExtensionPageTab(SETTINGS_URL)).toBeUndefined();
    });
});

describe('switchToSettingsTab', () => {
    it('switches to the settings tab that is already open, and its window', async () => {
        contexts = [{ tabId: 7, windowId: 2, documentUrl: SETTINGS_URL }];
        tabsUpdate.mockImplementation((tabId: number) => Promise.resolve(tab(tabId, 2)));

        expect(await switchToSettings({ tab: tab(3, 1) })).toEqual(tab(7, 2));
        expect(tabsUpdate).toHaveBeenCalledWith(7, { active: true });
        expect(windowsUpdate).toHaveBeenCalledWith(2, { focused: true });
        expect(tabsCreate).not.toHaveBeenCalled();
    });

    it('opens the settings page next to the calendar when it is not open', async () => {
        await switchToSettings({ tab: { ...tab(3, 1), index: 4 } });
        expect(tabsCreate).toHaveBeenCalledWith(expect.objectContaining({ url: SETTINGS_URL, index: 5, windowId: 1 }));
    });

    it("switches to the settings tab in the popup's window when it's open in more than one", async () => {
        contexts = [
            { tabId: 4, windowId: 1, documentUrl: SETTINGS_URL },
            { tabId: 7, windowId: 2, documentUrl: SETTINGS_URL },
        ];
        await switchToSettings({});
        expect(tabsUpdate).toHaveBeenCalledWith(7, { active: true });
    });

    it("still opens the settings page when Chrome can't list the extension's pages", async () => {
        vi.mocked(chrome.runtime.getContexts).mockRejectedValue(new Error('getContexts is not a function'));
        vi.spyOn(console, 'error').mockImplementation(() => {});

        await switchToSettings({ tab: tab(3, 1) });
        expect(tabsCreate).toHaveBeenCalledWith(expect.objectContaining({ url: SETTINGS_URL }));
    });

    it('opens a new one when the settings tab closes as it is being switched to', async () => {
        contexts = [{ tabId: 7, windowId: 2, documentUrl: SETTINGS_URL }];
        tabsUpdate.mockRejectedValue(new Error('No tab with id: 7'));

        await switchToSettings({});
        expect(tabsCreate).toHaveBeenCalledWith(expect.objectContaining({ url: SETTINGS_URL }));
    });
});
