import { UserSchedule } from '@shared/types/UserSchedule';
import { ExtensionStorage } from 'browser-extension-toolkit';

import type { ExtensionStorageData } from '../types/ExtensionStorage';
import { generateRandomId } from '../util/random';

/**
 * A store that is used for storing user schedules
 */
export interface IUserScheduleStore extends ExtensionStorageData {
    schedules: UserSchedule[];
    activeIndex: number;
}

export const UserScheduleStore = new ExtensionStorage<IUserScheduleStore>({
    area: 'local',
    serialize: true,
});

UserScheduleStore.bulkSet({
    schedules: [
        new UserSchedule({
            courses: [],
            id: generateRandomId(),
            name: 'Schedule 1',
            hours: 0,
            updatedAt: Date.now(),
        }),
    ],
    activeIndex: 0,
});

// Listen for changes
UserScheduleStore.addChangeListener(changes => {
    console.log('UserScheduleStore changes: ', changes);
});
