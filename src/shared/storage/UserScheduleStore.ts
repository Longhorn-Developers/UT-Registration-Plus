import { createLocalStore, debugStore } from 'chrome-extension-toolkit';
import { UserSchedule } from 'src/shared/types/UserSchedule';
import { v4 as uuidv4 } from 'uuid';

interface IUserScheduleStore {
    schedules: UserSchedule[];
}

/**
 * A store that is used for storing user schedules (and the active schedule)
 */
export const userScheduleStore = createLocalStore<IUserScheduleStore>({
    schedules: [
        new UserSchedule({
            courses: [],
            id: uuidv4(),
            name: 'Schedule 1',
            creditHours: 0,
        }),
    ],
});


debugStore({ userScheduleStore });
