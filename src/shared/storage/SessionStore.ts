import { createSessionStore, debugStore } from 'chrome-extension-toolkit';

interface ISessionStore {
    chromeSessionId?: string;
}

export const sessionStore = createSessionStore<ISessionStore>({
    chromeSessionId: undefined,
});

debugStore({ sessionStore });
