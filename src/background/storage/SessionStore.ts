import { createSessionStore, debugStore } from 'chrome-extension-toolkit';

interface ISessionStore {
    chromeSessionId?: string;
}

export const SessionStore = createSessionStore<ISessionStore>({
    chromeSessionId: undefined,
});

debugStore({ SessionStore });
