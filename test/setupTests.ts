import { vi } from 'vitest';
import type Browser from 'webextension-polyfill';

// Minimal shim for webextension-polyfill used in tests.
// Provide the pieces for runtime.getURL, storage, tabs, and messages.
const browserStub = {
    runtime: {
        getURL: (path: string) => path,
        sendMessage: async (_msg: unknown) => undefined,
        onMessage: {
            addListener: () => {},
            removeListener: () => {},
        },
    },
    storage: {
        local: {
            get: async (_keys?: string | string[] | Record<string, unknown>) => ({}),
            set: async (_obj: Record<string, unknown>) => undefined,
            remove: async (_key: string | string[]) => undefined,
            clear: async () => undefined,
        },
        sync: {
            get: async () => ({}),
            set: async () => undefined,
        },
    },
    tabs: {
        create: async (_opts: Browser.Tabs.CreateCreatePropertiesType) => ({}),
        query: async (_q: Browser.Tabs.QueryQueryInfoType) => [],
    },
    notifications: {
        create: async () => undefined,
    },
    // Add more stubs here as tests require
};

vi.mock('webextension-polyfill', () => ({ default: browserStub }));
