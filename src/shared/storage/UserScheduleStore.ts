import { createLocalStore } from '@chrome-extension-toolkit';
import { UserSchedule } from '@shared/types/UserSchedule';

import { generateRandomId } from '../util/random';

interface IUserScheduleStore {
    schedules: UserSchedule[];
    activeIndex: number;
}

/**
 * A store that is used for storing user schedules (and the active schedule)
 */
export const UserScheduleStore = createLocalStore<IUserScheduleStore>('UserScheduleStore', {
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

// debugStore({ userScheduleStore: UserScheduleStore });
