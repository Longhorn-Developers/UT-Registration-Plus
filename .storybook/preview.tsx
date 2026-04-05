import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Preview } from '@storybook/react-vite';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import React from 'react';

import { version } from '../package.json';

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

type ListenerFunction = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: chrome.storage.AreaName
) => void;
const allListeners = new Map<ListenerFunction, ListenerFunction>();

function createMockStorageArea(areaName: chrome.storage.AreaName) {
    let data = {};
    return {
        /**
         * Removes all items from storage.
         */
        async clear() {
            data = {};
        },
        /**
         * Gets one or more items from storage.
         * @param keys A single key to get, list of keys to get, or a dictionary specifying default values.
         * An empty list or object will return an empty result object. Pass in null to get the entire contents of storage.
         */
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
        /**
         * Gets the amount of space (in bytes) being used by one or more items.
         */
        async getBytesInUse() {
            return 0;
        },
        /**
         * Removes one or more items from storage.
         * @param keys A single key or a list of keys for items to remove.
         */
        async remove(keys: string | string[]) {
            const keyList = Array.isArray(keys) ? keys : [keys];
            for (const key of keyList) {
                for (const listener of allListeners.values()) {
                    listener({ [key]: { oldValue: data[key], newValue: undefined } }, areaName);
                }
                delete data[key];
            }
        },
        /**
         * Sets multiple items.
         * @param items An object which gives each key/value pair to update storage with.
         */
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

// mock chrome api
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
        getManifest(): chrome.runtime.Manifest {
            return {
                manifest_version: 3,
                name: 'fake-name',
                version,
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
