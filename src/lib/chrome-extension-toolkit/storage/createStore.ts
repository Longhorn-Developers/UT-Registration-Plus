/* eslint-disable no-await-in-loop */
import { useRef, useSyncExternalStore } from "react";

import type { Serializable } from "../types";
import { Security } from "./Security";

/** A utility type that forces you to declare all the values specified in the type interface for a module. */
export type StoreDefaults<T> = {
    [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
        ? T[P]
        : T[P] | undefined;
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
     * Preloads the entire store into memory for synchronous reads.
     */
    preload(): Promise<Serializable<T>>;

    /**
     * Returns whether the store snapshot has been loaded into memory.
     */
    isReady(): boolean;

    /**
     * Reads the current snapshot during render. Suspends until preload completes.
     */
    read(): Serializable<T>;

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
        key: K,
    ): [
        K extends keyof T ? Serializable<T[K]> : Serializable<T>,
        (
            value: K extends keyof T
                ? Serializable<T[K]>
                : Partial<Serializable<T>>,
        ) => Promise<void>,
    ];

    /**
     * A react hook that allows you to get and set the value of the specified key in the store from a functional component.
     * @param key the key to get the value of or null to get the entire store
     * @param defaultValue the default value to use if the key is not already set
     */
    use<K extends keyof T | null>(
        key: K,
        defaultValue: K extends keyof T ? Serializable<T[K]> : Serializable<T>,
    ): [
        K extends keyof T ? Serializable<T[K]> : Serializable<T>,
        (
            value: K extends keyof T
                ? Serializable<T[K]>
                : Partial<Serializable<T>>,
        ) => Promise<void>,
    ];

    /**
     * React hook that synchronously reads from the in-memory store snapshot.
     */
    useStore(): Serializable<T>;
    useStore<S>(selector: (value: Serializable<T>) => S, isEqual?: (a: S, b: S) => boolean): S;

    /**
     * Subscribes to changes in the specified key in the store, and calls the specified function when the key changes.
     * @param key the key to subscribe to
     * @param callback the function to call when the key changes
     */
    subscribe<K extends keyof T>(
        key: K,
        callback: OnChangedFunction<T[K]>,
    ): (changes: Record<string, chrome.storage.StorageChange>, area: string) => void;
    subscribe<K extends keyof T>(
        key: K[],
        callback: OnChangedFunction<T[K]>,
    ): (changes: Record<string, chrome.storage.StorageChange>, area: string) => void;

    /**
     * Removes a subscription that was added with the subscribe function.
     * @param sub the subscription function that was added
     */
    unsubscribe(sub: (changes: Record<string, chrome.storage.StorageChange>, area: string) => void): void;
};

/**
 * Options that modify the behavior of the store
 */
type StoreOptions = {
    /**
     * Whether or not to encrypt the data before storing it, and decrypt it when retrieving it. Defaults to false.
     */
    isEncrypted?: boolean;
    /**
     * Whether to use a prefix based on the name of the store, such as "UserScheduleStore:myKey" instead of "myKey". Defaults to true.
     */
    usePrefix?: boolean;
};

const security = new Security();

export function suspendUntilStoresReady(stores: Store<any>[]) {
    const pendingStores = stores.filter((store) => !store.isReady());

    if (pendingStores.length > 0) {
        throw Promise.all(pendingStores.map((store) => store.preload()));
    }
}

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
    area: "sync" | "local" | "session" | "managed",
    options?: StoreOptions,
): Store<T> {
    const prefix = (options?.usePrefix ?? true) ? `${storeId}:` : "";
    const makeActualKey = (rawKey: string) => `${prefix}${rawKey}`;
    const removePrefix = (prefixedKey: string) =>
        prefixedKey.replace(prefix, "");

    const keys = Object.keys(defaults) as string[];
    const actualKeys = keys.map(makeActualKey);

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
    let snapshot: Serializable<T> | null = null;
    let preloadPromise: Promise<Serializable<T>> | null = null;
    const externalStoreListeners = new Set<() => void>();

    const notifySnapshotListeners = () => {
        externalStoreListeners.forEach((listener) => listener());
    };

    const subscribeSnapshot = (listener: () => void) => {
        externalStoreListeners.add(listener);

        return () => {
            externalStoreListeners.delete(listener);
        };
    };

    const readStoredValue = async (value: unknown) =>
        isEncrypted && value !== undefined
            ? await security.decrypt(value)
            : value;

    const loadSnapshot = async (): Promise<Serializable<T>> => {
        if (!hasInitialized) {
            await store.initialize();
        }

        const fullStore = await chrome.storage[area].get(actualKeys);
        const nextSnapshot = {} as Serializable<T>;

        for (const key of keys) {
            const actualKey = makeActualKey(key);
            // @ts-expect-error - runtime object construction
            nextSnapshot[key] = await readStoredValue(fullStore[actualKey]);
        }

        snapshot = nextSnapshot;
        notifySnapshotListeners();

        return nextSnapshot;
    };

    const ensurePreloaded = async () => {
        if (snapshot !== null) {
            return snapshot;
        }

        if (preloadPromise === null) {
            preloadPromise = loadSnapshot().finally(() => {
                preloadPromise = null;
            });
        }

        return preloadPromise;
    };

    const updateSnapshotKey = async (actualKey: string, newValue: unknown, alreadyDecoded = false) => {
        if (snapshot === null) {
            await ensurePreloaded();
        }

        if (snapshot === null) {
            return;
        }

        const nextSnapshot = { ...snapshot };
        const key = removePrefix(actualKey) as keyof T & string;
        // @ts-expect-error - runtime object construction
        nextSnapshot[key] = alreadyDecoded ? newValue : await readStoredValue(newValue);
        snapshot = nextSnapshot;
        notifySnapshotListeners();
    };

    const updateSnapshotBatch = async (entries: Record<string, unknown>, alreadyDecoded = false) => {
        if (snapshot === null) {
            await ensurePreloaded();
        }

        if (snapshot === null) {
            return;
        }

        const nextSnapshot = { ...snapshot };
        for (const [actualKey, newValue] of Object.entries(entries)) {
            const key = removePrefix(actualKey) as keyof T & string;
            // @ts-expect-error - runtime object construction
            nextSnapshot[key] = alreadyDecoded ? newValue : await readStoredValue(newValue);
        }
        snapshot = nextSnapshot;
        notifySnapshotListeners();
    };

    // Keys that were just set locally — the storage listener should skip these
    // to avoid a redundant re-render with deserialized (new-reference) data.
    const locallyPendingKeys = new Set<string>();

    const storageListener = async (
        changes: Record<string, chrome.storage.StorageChange>,
        areaName: string,
    ) => {
        if (areaName !== area) {
            return;
        }

        const changedKeys = Object.keys(changes).filter((key) => {
            if (!actualKeys.includes(key)) return false;
            if (locallyPendingKeys.has(key)) {
                locallyPendingKeys.delete(key);
                return false;
            }
            return true;
        });
        if (changedKeys.length === 0) {
            return;
        }

        const entries: Record<string, unknown> = {};
        for (const actualKey of changedKeys) {
            entries[actualKey] = changes[actualKey]?.newValue;
        }
        await updateSnapshotBatch(entries);
    };

    const storageChangeEvent = globalThis.chrome?.storage?.onChanged;
    storageChangeEvent?.addListener(storageListener);

    store.initialize = async () => {
        const data = await chrome.storage[area].get(actualKeys);
        const missingKeys = actualKeys.filter((key) => data[key] === undefined);

        if (missingKeys.length) {
            const defaultsToSet = {};

            for (const key of missingKeys) {
                // @ts-expect-error
                const value = defaults[removePrefix(key)];
                // @ts-expect-error
                defaultsToSet[key] = isEncrypted
                    ? await security.encrypt(value)
                    : value;
            }

            await chrome.storage[area].set(defaultsToSet);
        }
        hasInitialized = true;
    };

    store.preload = ensurePreloaded;
    store.isReady = () => snapshot !== null;
    store.read = () => {
        if (snapshot === null) {
            throw ensurePreloaded();
        }

        return snapshot;
    };

    store.get = async (key: any) => {
        if (snapshot !== null) {
            return (snapshot as any)[key];
        }

        await ensurePreloaded();
        return (snapshot as any)?.[key];
    };

    store.set = async (key: any, value?: any) => {
        if (!hasInitialized) {
            await store.initialize();
        }

        // Handle the case where key is an object
        if (typeof key === "object" && value === undefined) {
            const entriesToRemove: string[] = [];
            const entriesToSet = {};
            const rawEntries: Record<string, unknown> = {};

            for (const [k, v] of Object.entries(key)) {
                const actualKey = makeActualKey(k);
                if (v === undefined) {
                    // Prepare to remove this key
                    entriesToRemove.push(actualKey);
                } else {
                    // @ts-expect-error
                    entriesToSet[actualKey] = isEncrypted
                        ? await security.encrypt(v)
                        : v;
                    rawEntries[actualKey] = v;
                }
            }

            // Mark keys as locally pending so the storage listener skips them
            for (const actualKey of Object.keys(entriesToSet)) {
                locallyPendingKeys.add(actualKey);
            }

            // Optimistically update snapshot (single notification for all keys)
            await updateSnapshotBatch(rawEntries, true);

            // Remove keys with undefined values
            if (entriesToRemove.length > 0) {
                await chrome.storage[area].remove(entriesToRemove);
            }

            // Persist to storage
            if (Object.keys(entriesToSet).length > 0) {
                await chrome.storage[area].set(entriesToSet);
            }

            return;
        }
        // now we know key is a string, so lets either set or remove it directly

        const actualKey = makeActualKey(key);
        if (value === undefined) {
            // Remove if value is explicitly undefined
            return await chrome.storage[area].remove(actualKey);
        }

        // Mark as locally pending so the storage listener skips this key
        locallyPendingKeys.add(actualKey);

        // Optimistically update snapshot before persisting
        await updateSnapshotKey(actualKey, value, true);

        // Set the value, applying encryption if necessary
        await chrome.storage[area].set({
            [actualKey]: isEncrypted ? await security.encrypt(value) : value,
        });
    };

    store.remove = async (key: any) => {
        if (!hasInitialized) {
            await store.initialize();
        }

        const actualKey = makeActualKey(key);
        await chrome.storage[area].remove(actualKey);
        await updateSnapshotKey(actualKey, undefined, true);
    };

    store.all = async () => {
        return await ensurePreloaded();
    };

    store.keys = () => keys as (keyof T & string)[];

    store.subscribe = (key: string | string[], callback) => {
        // @ts-expect-error
        const sub = async (changes, areaName) => {
            const keys = Array.isArray(key) ? key : [key];
            const actualKeys = keys.map(makeActualKey);

            if (areaName !== area) return;

            // make sure that there are keys is in the changes object
            const subKeys = Object.keys(changes).filter((k) =>
                actualKeys.includes(k),
            );
            if (!subKeys.length) return;

            subKeys.forEach(async (actualKey) => {
                const key = removePrefix(actualKey);
                const [oldValue, newValue] = await Promise.all([
                    isEncrypted
                        ? security.decrypt(changes[actualKey].oldValue)
                        : changes[actualKey].oldValue,
                    isEncrypted
                        ? security.decrypt(changes[actualKey].newValue)
                        : changes[actualKey].newValue,
                ]);

                callback({
                    key,
                    oldValue,
                    newValue,
                });
            });
        };

        storageChangeEvent?.addListener(sub);
        return sub;
    };

    store.unsubscribe = (sub) => {
        storageChangeEvent?.removeListener(sub);
    };

    store.useStore = ((
        selector = ((value) => value) as (value: Serializable<T>) => unknown,
        isEqual: ((a: unknown, b: unknown) => boolean) | undefined = undefined,
    ) => {
        const selectionCacheRef = useRef<{
            snapshot: Serializable<T>;
            selection: unknown;
        } | null>(null);
        const defaultsSelectionCacheRef = useRef<{
            snapshot: Serializable<T>;
            selection: unknown;
        } | null>(null);

        store.read();

        const getSelection = (
            nextSnapshot: Serializable<T>,
            cacheRef: typeof selectionCacheRef,
        ) => {
            const cachedSelection = cacheRef.current;

            if (cachedSelection?.snapshot === nextSnapshot) {
                return cachedSelection.selection;
            }

            const selection = selector(nextSnapshot);

            // If the selection is structurally equal to the cached one, return
            // the cached reference so useSyncExternalStore skips the re-render.
            if (cachedSelection && isEqual?.(cachedSelection.selection, selection)) {
                cacheRef.current = {
                    snapshot: nextSnapshot,
                    selection: cachedSelection.selection,
                };
                return cachedSelection.selection;
            }

            cacheRef.current = {
                snapshot: nextSnapshot,
                selection,
            };

            return selection;
        };

        return useSyncExternalStore(
            subscribeSnapshot,
            () => getSelection(snapshot as Serializable<T>, selectionCacheRef),
            () =>
                getSelection(
                    defaults as Serializable<T>,
                    defaultsSelectionCacheRef,
                ),
        );
    }) as Store<T>["useStore"];

    // @ts-ignore
    store.use = (key: keyof T | null, defaultValue?: any) => {
        const hasExplicitDefault = defaultValue !== undefined;
        const selectedValue = store.useStore((value) => {
            if (key === null) {
                return value;
            }

            const keyValue = (value as any)[key];
            if (keyValue === undefined && hasExplicitDefault) {
                return defaultValue;
            }

            return keyValue;
        });

        // @ts-expect-error
        const set = async (newValue) => {
            if (key === null) {
                await store.set(newValue as any);
            } else {
                await store.set(key, newValue as any);
            }
        };

        return [selectedValue, set] as any;
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
export function createLocalStore<T>(
    storeId: string,
    defaults: StoreDefaults<T>,
    options?: StoreOptions,
): Store<T> {
    return createStore(storeId, defaults, "local", options);
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
export function createSyncStore<T>(
    storeId: string,
    defaults: StoreDefaults<T>,
    options?: StoreOptions,
): Store<T> {
    return createStore(storeId, defaults, "sync", options);
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
export function createManagedStore<T>(
    storeId: string,
    defaults: StoreDefaults<T>,
    options?: StoreOptions,
): Store<T> {
    return createStore(storeId, defaults, "managed", options);
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
export function createSessionStore<T>(
    storeId: string,
    defaults: StoreDefaults<T>,
    options?: StoreOptions,
): Store<T> {
    return createStore(storeId, defaults, "session", options);
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
