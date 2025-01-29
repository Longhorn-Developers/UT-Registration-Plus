import type { UserSchedule } from '@shared/types/UserSchedule';
import { ExtensionStorage } from 'browser-extension-toolkit';

import type { ExtensionStorageData } from '../types/ExtensionStorage';

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
