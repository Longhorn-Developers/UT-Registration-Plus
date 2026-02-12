/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react';

import type { Serializable } from '../types';
import { Security } from './Security';

/** A utility type that forces you to declare all the values specified in the type interface for a module. */
export type StoreDefaults<T> = {
    [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined;
};

/**
 * Represents a change in data within the store.
 */
export type DataChange<T> = {
    key: string;
    /**
     * The old value of the data. This will be undefined if the data was just initialized.
     */
    oldValue?: Serializable<T>;
    /**
     * The new value of the data.
     */
    newValue: Serializable<T>;
};

/**
 * A function that is called when the data in the store changes.
 */
export type OnChangedFunction<T> = (changes: DataChange<T>) => void;

/**
 * A virtual wrapper around the chrome.storage API that allows you to segment and compartmentalize your data.
 * The data is all stored at the top level of the storage area, so you should namespace your keys to avoid collisions.
 */
export type Store<T = {}> = {
    /**
     * A unique identifier for the store. This will be prepended to all keys in the store to avoid collisions.
     */
    readonly storeId: string;
    /**
     * The options that were passed to the createStore function
     */
    readonly options: StoreOptions;

    /**
     * The default values for the store. These were passed to the createStore function and will be used to initialize the store if the key is not already set.
     */
    readonly defaults: StoreDefaults<T>;
    /**
     * Initializes the store by setting any keys that are not already set to their default values. This will be called automatically when you first access a getter or setter.
     */
    initialize(): Promise<void>;

    /**
     * Gets the value of the specified key from the store.
     * @param key the key to get the value of
     * @returns a promise that resolves to the value of the specified key (wrapped in a Serialized type)
     */
    get<K extends keyof T>(key: K): Promise<Serializable<T[K]>>;

    /**
     * Sets the value of the specified key in the store.
     * @param key the key to set the value of
     * @param value the value to set the key to
     */
    set<K extends keyof T>(key: K, value: Serializable<T[K]>): Promise<void>;

    /**
     * Sets the store with the values in the object passed in.
     * @param values an object containing the keys and values to set in the store
     */
    set(values: Partial<Serializable<T>>): Promise<void>;

    /**
     * Removes a specific key from the store.
     * @param key the key to remove from the store
     */
    remove<K extends keyof T>(key: K): Promise<void>;

    /**
     * Returns a promise that resolves to the entire contents of the store.
     */
    all(): Promise<Serializable<T>>;

    /**
     * Returns an array of all the keys in the store.
     */
    keys(): (keyof T & string)[];

    /**
     * A react hook that allows you to get and set the value of the specified key in the store from a functional component.
     * @param key the key to get the value of or null to get the entire store
     * @returns a tuple containing the value of the specified key, and a function to set the value
     */
    use<K extends keyof T | null>(
        key: K
    ): [
        K extends keyof T ? Serializable<T[K]> : Serializable<T>,
        (value: K extends keyof T ? Serializable<T[K]> : Partial<Serializable<T>>) => Promise<void>,
    ];

    /**
     * A react hook that allows you to get and set the value of the specified key in the store from a functional component.
     * @param key the key to get the value of or null to get the entire store
     * @param defaultValue the default value to use if the key is not already set
     */
    use<K extends keyof T | null>(
        key: K,
        defaultValue: K extends keyof T ? Serializable<T[K]> : Serializable<T>
    ): [
        K extends keyof T ? Serializable<T[K]> : Serializable<T>,
        (value: K extends keyof T ? Serializable<T[K]> : Partial<Serializable<T>>) => Promise<void>,
    ];

    /**
     * Subscribes to changes in the specified key in the store, and calls the specified function when the key changes.
     * @param key the key to subscribe to
     * @param callback the function to call when the key changes
     */
    // @ts-expect-error
    subscribe<K extends keyof T>(key: K, callback: OnChangedFunction<T[K]>): (changes, area) => void;
    // @ts-expect-error
    subscribe<K extends keyof T>(key: K[], callback: OnChangedFunction<T[K]>): (changes, area) => void;

    /**
     * Removes a subscription that was added with the subscribe function.
     * @param sub the subscription function that was added
     */
    // @ts-expect-error
    unsubscribe(sub: (changes, area) => void): void;
};

/**
 * Options that modify the behavior of the store
 */
type StoreOptions = {
    /**
     * Whether or not to encrypt the data before storing it, and decrypt it when retrieving it. Defaults to false.
     */
    isEncrypted?: boolean;
};

const security = new Security();

/**
 * A function that creates a virtual storage bucket within the chrome.storage API.
 *
 * @param defaults the default values for the store (these will be used to initialize the store if the key is not already set, and will be used as the type for the getters and setters)
 * @param area the storage area to use. Defaults to 'local'
 * @returns an object which contains getters/setters for the keys in the defaults object, as well as an initialize function and an onChanged functions
 */
function createStore<T>(
    storeId: string,
    defaults: StoreDefaults<T>,
    area: 'sync' | 'local' | 'session' | 'managed',
    options?: StoreOptions
): Store<T> {
    const keys = Object.keys(defaults) as string[];
    const actualKeys = keys.map(key => `${storeId}:${key}`);

    let isEncrypted = options?.isEncrypted || false;

    if (isEncrypted && !process.env.EXTENSION_STORAGE_PASSWORD) {
        throw new Error(Security.MISSING_PASSWORD_ERROR_MESSAGE);
    }

    const store = {
        defaults,
        storeId,
        options,
    } as Store<T>;

    let hasInitialized = false;
    store.initialize = async () => {
        const data = await chrome.storage[area].get(actualKeys);
        const missingKeys = actualKeys.filter(key => data[key] === undefined);

        if (missingKeys.length) {
            const defaultsToSet = {};

            for (const key of missingKeys) {
                // @ts-expect-error
                const value = defaults[key.replace(`${storeId}:`, '')];
                // @ts-expect-error
                defaultsToSet[key] = isEncrypted ? await security.encrypt(value) : value;
            }

            await chrome.storage[area].set(defaultsToSet);
        }
        hasInitialized = true;
    };

    store.get = async (key: any) => {
        if (!hasInitialized) {
            await store.initialize();
        }

        const actualKey = `${storeId}:${key}`;

        const value = (await chrome.storage[area].get(actualKey))[actualKey];
        return isEncrypted ? await security.decrypt(value) : value;
    };

    store.set = async (key: any, value?: any) => {
        if (!hasInitialized) {
            await store.initialize();
        }

        // Handle the case where key is an object
        if (typeof key === 'object' && value === undefined) {
            const entriesToRemove: string[] = [];
            const entriesToSet = {};

            for (const [k, v] of Object.entries(key)) {
                const actualKey = `${storeId}:${k}`;
                if (v === undefined) {
                    // Prepare to remove this key
                    entriesToRemove.push(actualKey);
                } else {
                    // @ts-expect-error
                    entriesToSet[actualKey] = isEncrypted ? await security.encrypt(v) : v;
                }
            }

            // Remove keys with undefined values
            if (entriesToRemove.length > 0) {
                await chrome.storage[area].remove(entriesToRemove);
            }

            // Set keys with defined values
            if (Object.keys(entriesToSet).length > 0) {
                await chrome.storage[area].set(entriesToSet);
            }

            return;
        }
        // now we know key is a string, so lets either set or remove it directly

        const actualKey = `${storeId}:${key}`;
        if (value === undefined) {
            // Remove if value is explicitly undefined
            return await chrome.storage[area].remove(actualKey);
        }

        // Set the value, applying encryption if necessary
        await chrome.storage[area].set({
            [actualKey]: isEncrypted ? await security.encrypt(value) : value,
        });
    };

    store.remove = async (key: any) => {
        if (!hasInitialized) {
            await store.initialize();
        }

        const actualKey = `${storeId}:${key}`;
        await chrome.storage[area].remove(actualKey);
    };

    store.all = async () => {
        if (!hasInitialized) {
            await store.initialize();
        }
        const fullStore = await chrome.storage[area].get(actualKeys);
        if (isEncrypted) {
            await Promise.all(
                keys.map(async key => {
                    const actualKey = `${storeId}:${key}`;
                    fullStore[key] = await security.decrypt(fullStore[actualKey]);
                })
            );
        }
        // now we need to remove the storeId from the keys
        Object.keys(fullStore).forEach(actualKey => {
            const newKey = actualKey.replace(`${storeId}:`, '');
            fullStore[newKey] = fullStore[actualKey];
            delete fullStore[actualKey];
        });
        return fullStore as Serializable<T>;
    };

    store.keys = () => keys as (keyof T & string)[];

    store.subscribe = (key: string | string[], callback) => {
        // @ts-expect-error
        const sub = async (changes, areaName) => {
            const keys = Array.isArray(key) ? key : [key];
            const actualKeys = keys.map(k => `${storeId}:${k}`);

            if (areaName !== area) return;

            // make sure that there are keys is in the changes object
            const subKeys = Object.keys(changes).filter(k => actualKeys.includes(k));
            if (!subKeys.length) return;

            subKeys.forEach(async actualKey => {
                const key = actualKey.replace(`${storeId}:`, '');
                const [oldValue, newValue] = await Promise.all([
                    isEncrypted ? security.decrypt(changes[actualKey].oldValue) : changes[actualKey].oldValue,
                    isEncrypted ? security.decrypt(changes[actualKey].newValue) : changes[actualKey].newValue,
                ]);

                callback({
                    key,
                    oldValue,
                    newValue,
                });
            });
        };

        chrome.storage.onChanged.addListener(sub);
        return sub;
    };

    store.unsubscribe = sub => {
        chrome.storage.onChanged.removeListener(sub);
    };

    // @ts-ignore
    store.use = (key: keyof T | null, defaultValue?: key extends null ? T : T[typeof key]) => {
        const initialValue: any = (() => {
            // an explicit default value was passed, use it
            if (arguments.length === 2) {
                return defaultValue;
            }
            // a key was passed, but no default value was passed, use the default value from the defaults object
            if (key === null) {
                return defaults;
            }
            // no key was passed, use the default value from the defaults object
            return defaults[key];
        })();

        const [value, setValue] = useState(initialValue);

        const onChange = ({ key: k, newValue }: DataChange<T>) => {
            if (key === null) {
                // @ts-expect-error
                setValue(prev => ({ ...prev, [k]: newValue }) as any);
            } else {
                setValue(newValue as any);
            }
        };

        useEffect(() => {
            if (key === null) {
                store
                    .all()
                    .then(setValue)
                    .then(() => {
                        store.subscribe(store.keys(), onChange as any);
                    });
            } else {
                store
                    .get(key)
                    .then(setValue)
                    .then(() => {
                        store.subscribe(key, onChange as any);
                    });
            }
            return () => {
                store.unsubscribe(onChange as any);
            };
        }, []);

        // @ts-expect-error
        const set = async newValue => {
            if (key === null) {
                await store.set(newValue as any);
            } else {
                await store.set(key, newValue as any);
            }
        };

        return [value, set] as any;
    };

    return store;
}

/**
 * A function that creates a virtual storage bucket within the chrome.storage.local API.
 * This store will persist across browser sessions and be stored on the user's computer.
 *
 * @param storeId A unique key to use for this store. This will be prepended to all keys in the store to avoid collisions. ex: 'my-store' -> 'my-store:myKey'
 * @param defaults the default values for the store (these will be used to initialize the store if the key is not already set, and will be used as the type for the getters and setters)
 * @param computed an optional function that allows you to override the generated getters and setters with your own. Provides a reference to the store itself so you can access this store's getters and setters.
 * @param area the storage area to use. Defaults to 'local'
 * @returns an object which contains getters/setters for the keys in the defaults object, as well as an initialize function and an onChanged functions
 */
export function createLocalStore<T>(storeId: string, defaults: StoreDefaults<T>, options?: StoreOptions): Store<T> {
    return createStore(storeId, defaults, 'local', options);
}

/**
 * A function that creates a virtual storage bucket within the chrome.storage.sync API.
 * This store will persist across browser sessions and be stored on the user's Google account (if they are logged in).
 * This means that the data will be synced across all of the user's devices.
 *
 * @param storeId A unique key to use for this store. This will be prepended to all keys in the store to avoid collisions. ex: 'my-store' -> 'my-store:myKey'
 * @param defaults the default values for the store (these will be used to initialize the store if the key is not already set, and will be used as the type for the getters and setters)
 * @param options options that modify the behavior of the store
 * @returns an object which contains getters/setters for the keys in the defaults object, as well as an initialize function and an onChanged functions
 */
export function createSyncStore<T>(storeId: string, defaults: StoreDefaults<T>, options?: StoreOptions): Store<T> {
    return createStore(storeId, defaults, 'sync', options);
}

/**
 * A function that creates a virtual storage bucket within the chrome.storage.managed API.
 * This store will persist across browser sessions and managed by the administrator of the user's computer.
 *
 * @param storeId A unique key to use for this store. This will be prepended to all keys in the store to avoid collisions. ex: 'my-store' -> 'my-store:myKey'
 * @param defaults the default values for the store (these will be used to initialize the store if the key is not already set, and will be used as the type for the getters and setters)
 * @param options options that modify the behavior of the store
 * @returns an object which contains getters/setters for the keys in the defaults object, as well as an initialize function and an onChanged functions
 * @see https://developer.chrome.com/docs/extensions/reference/storage/#type-ManagedStorageArea
 *
 */
export function createManagedStore<T>(storeId: string, defaults: StoreDefaults<T>, options?: StoreOptions): Store<T> {
    return createStore(storeId, defaults, 'managed', options);
}

/**
 * A function that creates a virtual storage bucket within the chrome.storage.session API.
 * This store will NOT persist across browser sessions and will be stored in memory. This will reset when the browser is closed.
 *
 * @param storeId A unique key to use for this store. This will be prepended to all keys in the store to avoid collisions. ex: 'my-store' -> 'my-store:myKey'
 * @param defaults the default values for the store (these will be used to initialize the store if the key is not already set, and will be used as the type for the getters and setters)
 * @param options options that modify the behavior of the store
 * @returns an object which contains getters/setters for the keys in the defaults object, as well as an initialize function and an onChanged functions
 */
export function createSessionStore<T>(storeId: string, defaults: StoreDefaults<T>, options?: StoreOptions): Store<T> {
    return createStore(storeId, defaults, 'session', options);
}

// interface MyStore {
//     name: string;
//     age: number;
//     isCool?: boolean;
// }
// const store = createLocalStore<MyStore>('my-store', {
//     age: 0,
//     isCool: false,
//     name: 'John Doe',
// });
