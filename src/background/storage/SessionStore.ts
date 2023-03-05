import { createStore, Store } from 'chrome-extension-toolkit';

interface ISessionStore {
    chromeSessionId?: string;
}

export const SessionStore = createStore<ISessionStore>(
    'SESSION_STORE',
    {
        chromeSessionId: undefined,
    },
    {
        area: 'session',
    }
);
