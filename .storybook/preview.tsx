import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Preview } from '@storybook/react';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import React from 'react';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        Story => (
            <React.StrictMode>
                <ExtensionRoot>
                    <Story />
                </ExtensionRoot>
            </React.StrictMode>
        ),
    ],
};

let localData = {};
type ListenerFunction = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: chrome.storage.AreaName
) => void;
const localDataListeners = new Map<
    ListenerFunction, // key to remove listener
    (changes: { [key: string]: chrome.storage.StorageChange }) => void
>();

// mock chrome api
globalThis.chrome = {
    storage: {
        local: {
            /**
             * Removes all items from storage.
             * @param callback Optional.
             * Callback on success, or on failure (in which case runtime.lastError will be set).
             */
            async clear() {
                localData = {};
            },
            /**
             * Gets one or more items from storage.
             * @param keys A single key to get, list of keys to get, or a dictionary specifying default values.
             * An empty list or object will return an empty result object. Pass in null to get the entire contents of storage.
             * @return A Promise that resolves with an object containing items
             */
            async get(keys?: string | string[] | { [key: string]: any } | null) {
                if (keys === null) {
                    return localData;
                }
                if (Array.isArray(keys)) {
                    return keys.reduce((acc, key) => {
                        acc[key] = localData[key];
                        return acc;
                    }, {} as string); // funny types
                }
                if (typeof keys === 'string') {
                    return { [keys]: localData[keys] };
                }
                return keys;
            },
            /**
             * Gets the amount of space (in bytes) being used by one or more items.
             * @param keys Optional. A single key or list of keys to get the total usage for. An empty list will return 0. Pass in null to get the total usage of all of storage.
             * @param callback Callback with the amount of space being used by storage, or on failure (in which case runtime.lastError will be set).
             * Parameter bytesInUse: Amount of space being used in storage, in bytes.
             */
            async getBytesInUse() {
                return 0;
            },
            /**
             * Removes one or more items from storage.
             * @param keys A single key or a list of keys for items to remove.
             * @param callback Optional.
             * Callback on success, or on failure (in which case runtime.lastError will be set).
             */
            async remove(keys: string | string[]) {
                if (Array.isArray(keys)) {
                    keys.forEach(key => {
                        for (const listener of localDataListeners.values()) {
                            listener({ [key]: { oldValue: localData[key], newValue: undefined } });
                        }

                        delete localData[key];
                    });
                } else {
                    for (const listener of localDataListeners.values()) {
                        listener({ [keys]: { oldValue: localData[keys], newValue: undefined } });
                    }

                    delete localData[keys];
                }
            },
            /**
             * Sets multiple items.
             * @param items An object which gives each key/value pair to update storage with. Any other key/value pairs in storage will not be affected.
             * Primitive values such as numbers will serialize as expected. Values with a typeof "object" and "function" will typically serialize to {}, with the exception of Array (serializes as expected), Date, and Regex (serialize using their String representation).
             * @param callback Optional.
             * Callback on success, or on failure (in which case runtime.lastError will be set).
             */
            async set(items: { [key: string]: any }) {
                for (const key in items) {
                    const oldValue = localData[key];
                    localData[key] = JSON.parse(JSON.stringify(items[key]));

                    for (const listener of localDataListeners.values()) {
                        listener({ [key]: { oldValue: oldValue, newValue: localData[key] } });
                    }
                }
            },
        },
        onChanged: {
            /**
             * Registers an event listener callback to an event.
             * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
             */
            addListener(
                listener: (
                    changes: { [key: string]: chrome.storage.StorageChange },
                    areaName: chrome.storage.AreaName
                ) => void
            ) {
                localDataListeners.set(listener, (changes: { [key: string]: chrome.storage.StorageChange }) => {
                    listener(changes, 'local');
                });
            },

            /**
             * Deregisters an event listener callback from an event.
             * @param callback Listener that shall be unregistered.
             */
            removeListener(listener: ListenerFunction) {
                localDataListeners.delete(listener);
            },
        },
    },
    runtime: {
        id: 'fake-id',
        getManifest(): chrome.runtime.Manifest {
            return {
                manifest_version: 3,
                name: 'fake-name',
                version: '0.0.0',
            };
        },
        onMessage: {
            /**
             * Registers an event listener callback to an event.
             * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
             */
            addListener<T extends Function>(callback: T) {},

            /**
             * Deregisters an event listener callback from an event.
             * @param callback Listener that shall be unregistered.
             */
            removeListener<T extends Function>(callback: T) {},
        },
    },
} as typeof chrome;

// set updatedAt dates to be fixed

UserScheduleStore.get('schedules').then(schedules => {
    schedules.forEach(schedule => {
        schedule.updatedAt = new Date('2024-01-01 12:00').getTime();
    });
    UserScheduleStore.set('schedules', schedules);
});

export default preview;
