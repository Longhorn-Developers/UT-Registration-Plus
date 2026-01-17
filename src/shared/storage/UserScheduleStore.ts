import type { UserSchedule } from '@shared/types/UserSchedule';
import type { Serializable,Serialized } from 'chrome-extension-toolkit';
import { createLocalStore, debugStore } from 'chrome-extension-toolkit';
import browser from 'webextension-polyfill';

import { generateRandomId } from '../util/random';

/**
 * Interface for the Schedule Store
 */
interface IUserScheduleStore {
    schedules: Serialized<UserSchedule>[];
    activeIndex: number;
}

const defaults: IUserScheduleStore = {
    schedules: [
        {
            courses: [],
            id: generateRandomId(),
            name: 'Schedule 1',
            hours: 0,
            updatedAt: Date.now(),
        },
    ],
    activeIndex: 0,
};

/**
 * A store that is used for storing user schedules (and the active schedule).
 */
export const UserScheduleStore = createLocalStore<IUserScheduleStore>(defaults);

let initPromise: Promise<void> | null = null;

async function ensureInitialized() {
    if (initPromise) return initPromise;
    initPromise = (async function init() {
        try {
            await UserScheduleStore.initialize?.();
        } catch {
            // storage not ready
        }
    })();
    return initPromise;
}

// wrap get/set to ensure init is called first and provide fallback
const originalGet = UserScheduleStore.get.bind(UserScheduleStore);
const originalSet = UserScheduleStore.set.bind(UserScheduleStore);

UserScheduleStore.get = async function get<K extends keyof IUserScheduleStore>(key: K) {
    await ensureInitialized();
    try {
        return await originalGet(key);
    } catch {
        return defaults[key];
    }
} as typeof UserScheduleStore.get;

UserScheduleStore.set = async function set<K extends keyof IUserScheduleStore>(
    key: K | Partial<IUserScheduleStore>,
    value?: Serializable<IUserScheduleStore[K]>
) {
    await ensureInitialized();
    try {
        if (typeof key === 'string') {
            return await originalSet(key, value as Serializable<IUserScheduleStore[K]>);
        }
        return await originalSet(key as Partial<IUserScheduleStore>);
    } catch {
        // storage failed silently
    }
} as typeof UserScheduleStore.set;

// ensure that the toolkit uses the Promise-based API provided by the polyfill if we are in a callback-based environment
if (typeof chrome !== 'undefined' && !((chrome.storage.local.get as unknown) instanceof Promise)) {
    (chrome.storage.local as unknown as typeof browser.storage.local) = browser.storage.local;
}

debugStore({ userScheduleStore: UserScheduleStore });
