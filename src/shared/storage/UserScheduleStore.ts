import { createLocalStore, debugStore } from 'chrome-extension-toolkit';
import { UserSchedule } from 'src/shared/types/UserSchedule';

interface IUserScheduleStore {
    schedules: UserSchedule[];
}

/**
 * A store that is used for storing user schedules (and the active schedule)
 */
export const userScheduleStore = createLocalStore<IUserScheduleStore>({
    schedules: [],
});

debugStore({ userScheduleStore });
