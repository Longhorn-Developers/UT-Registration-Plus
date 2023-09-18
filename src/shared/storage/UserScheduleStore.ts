import { createLocalStore, debugStore } from 'chrome-extension-toolkit';
import { UserSchedule } from 'src/shared/types/UserSchedule';

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
            name: 'Schedule 1',
            creditHours: 0,
        }),
    ],
    activeIndex: 0,
});

debugStore({ userScheduleStore: UserScheduleStore });
