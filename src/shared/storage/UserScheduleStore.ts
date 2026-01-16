import type { UserSchedule } from '@shared/types/UserSchedule';
import type { Serialized } from 'chrome-extension-toolkit';
import { createLocalStore } from 'chrome-extension-toolkit';

import { generateRandomId } from '../util/random';

// --- POLYFILL START: Fix Firefox MV2 Storage to return Promises like Chrome MV3 ---
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    const promisify = (fn: any, context: any) => {
        return (...args: any[]) => {
            return new Promise((resolve, reject) => {
                // We intentionally use the callback approach which works in BOTH Chrome and Firefox
                fn.call(context, ...args, (result: any) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(result);
                    }
                });
            });
        };
    };

    // Only patch if it doesn't look like it returns a promise (simple heuristic)
    // Or we just force patch it to be safe, as the callback method is universal.
    // We patch 'get', 'set', and 'remove' to ensure the toolkit works fully.
    const originalGet = chrome.storage.local.get;
    // @ts-ignore
    chrome.storage.local.get = promisify(originalGet, chrome.storage.local);

    const originalSet = chrome.storage.local.set;
    // @ts-ignore
    chrome.storage.local.set = promisify(originalSet, chrome.storage.local);

    const originalRemove = chrome.storage.local.remove;
    // @ts-ignore
    chrome.storage.local.remove = promisify(originalRemove, chrome.storage.local);
}
// --- POLYFILL END ---

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
 * Wrapped with auto-initialization and fallback to defaults if storage APIs fail.
 */
export const UserScheduleStore = createLocalStore<IUserScheduleStore>('userScheduleStore', defaults);

let initPromise: Promise<void> | null = null;

async function ensureInitialized() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
        try {
            await UserScheduleStore.initialize?.();
        } catch {
            // storage not ready — that's ok, we'll use in-memory fallback
        }
    })();
    return initPromise;
}

// Wrap get/set to ensure init is called first and provide fallback
const originalGet = UserScheduleStore.get.bind(UserScheduleStore);
const originalSet = UserScheduleStore.set.bind(UserScheduleStore);

UserScheduleStore.get = async function <K extends keyof IUserScheduleStore>(key: K) {
    await ensureInitialized();
    try {
        return await originalGet(key);
    } catch {
        return defaults[key];
    }
} as typeof UserScheduleStore.get;

UserScheduleStore.set = async function <K extends keyof IUserScheduleStore>(
    key: K | Partial<Serialized<IUserScheduleStore>>,
    value?: any
) {
    await ensureInitialized();
    try {
        if (typeof key === 'string') {
            return await originalSet(key, value);
        }
        return await originalSet(key);
    } catch {
        // storage failed silently — in-memory only
    }
} as typeof UserScheduleStore.set;
