import { vi } from 'vitest';

// Minimal shim for webextension-polyfill used in tests.
// Provide the pieces the codebase expects: runtime.getURL, storage, tabs, and messages.

const browserStub: any = {
    runtime: {
        getURL: (path: string) => path,
        sendMessage: async (_msg: any) => undefined,
        onMessage: {
            addListener: () => {},
            removeListener: () => {},
        },
    },
    storage: {
        local: {
            get: async (keys?: any) => ({}),
            set: async (_obj: any) => undefined,
            remove: async (_key: any) => undefined,
            clear: async () => undefined,
        },
        sync: {
            get: async () => ({}),
            set: async () => undefined,
        },
    },
    tabs: {
        create: async (_opts: any) => ({}),
        query: async (_q: any) => [],
    },
    notifications: {
        create: async () => undefined,
    },
    // Add more stubs here as tests require
};

vi.mock('webextension-polyfill', () => ({ default: browserStub }));

// Also mock named import if code imports as `import * as browser from 'webextension-polyfill'`
vi.mocked = vi.mocked ?? ((_: any) => _);

export {};