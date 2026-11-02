import { createLocalStore } from '@chrome-extension-toolkit';

import type { WatchedSeatAlert } from '@shared/util/seatAlerts';

export interface ISeatAlertStore {
    watchedCourses: WatchedSeatAlert[];
    pendingCount: number;
}

export const SeatAlertStore = createLocalStore<ISeatAlertStore>(
    'SeatAlertStore',
    {
        watchedCourses: [],
        pendingCount: 0,
    },
    {
        usePrefix: false,
    }
);
