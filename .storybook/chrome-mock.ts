/// <reference types="chrome" />
import { version } from '../package.json';

type ListenerFunction = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: chrome.storage.AreaName
) => void;
const allListeners = new Map<ListenerFunction, ListenerFunction>();

function createMockStorageArea(areaName: chrome.storage.AreaName) {
    let data: Record<string, any> = {};
    return {
        async clear() {
            data = {};
        },
        async get(keys?: string | string[] | { [key: string]: any } | null) {
            if (keys === null) return data;
            if (Array.isArray(keys)) {
                return keys.reduce(
                    (acc, key) => {
                        acc[key] = data[key];
                        return acc;
                    },
                    {} as Record<string, any>
                );
            }
            if (typeof keys === 'string') return { [keys]: data[keys] };
            return keys;
        },
        async getBytesInUse() {
            return 0;
        },
        async remove(keys: string | string[]) {
            const keyList = Array.isArray(keys) ? keys : [keys];
            for (const key of keyList) {
                for (const listener of allListeners.values()) {
                    listener({ [key]: { oldValue: data[key], newValue: undefined } }, areaName);
                }
                delete data[key];
            }
        },
        async set(items: { [key: string]: any }) {
            for (const key in items) {
                const oldValue = data[key];
                data[key] = JSON.parse(JSON.stringify(items[key]));
                for (const listener of allListeners.values()) {
                    listener({ [key]: { oldValue, newValue: data[key] } }, areaName);
                }
            }
        },
    };
}

globalThis.chrome = {
    storage: {
        local: createMockStorageArea('local'),
        sync: createMockStorageArea('sync'),
        session: createMockStorageArea('session'),
        managed: createMockStorageArea('managed'),
        onChanged: {
            addListener(listener: ListenerFunction) {
                allListeners.set(listener, listener);
            },
            removeListener(listener: ListenerFunction) {
                allListeners.delete(listener);
            },
        },
    },
    runtime: {
        id: 'fake-id',
        getURL(path: string) {
            return `chrome-extension://fake-id/${path.replace(/^\//, '')}`;
        },
        getManifest(): chrome.runtime.Manifest {
            return {
                manifest_version: 3,
                name: 'fake-name',
                version,
            };
        },
        onMessage: {
            addListener<T extends Function>(_callback: T) {},
            removeListener<T extends Function>(_callback: T) {},
        },
    },
} as typeof chrome;
