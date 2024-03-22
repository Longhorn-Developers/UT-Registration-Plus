import { UserSchedule } from '@shared/types/UserSchedule';
import { createLocalStore, debugStore } from 'chrome-extension-toolkit';

import { generateRandomId } from '../util/random';

interface IUserScheduleStore {
    schedules: UserSchedule[];
    activeIndex: number;
}

/**
 * A store that is used for storing user schedules (and the active schedule)
 */
export const UserScheduleStore = createLocalStore<IUserScheduleStore>({
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

debugStore({ userScheduleStore: UserScheduleStore });
