import type { UserSchedule } from '@shared/types/UserSchedule';
import type { Serialized } from 'chrome-extension-toolkit';
import { createLocalStore } from 'chrome-extension-toolkit';

import { generateRandomId } from '../util/random';

interface IUserScheduleStore {
    schedules: Serialized<UserSchedule>[];
    activeIndex: number;
}

/**
 * A store that is used for storing user schedules (and the active schedule)
 */
export const UserScheduleStore = createLocalStore<IUserScheduleStore>('userScheduleStore', {
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
});
