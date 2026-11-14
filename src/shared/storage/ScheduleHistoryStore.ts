import { createSessionStore } from '@chrome-extension-toolkit';
import type { ScheduleHistory } from '@shared/util/scheduleHistory';

/**
 * The courses added to and removed from schedules that can be undone and redone. It's kept for the browser session
 * only, so closing the browser starts it over.
 */
export const ScheduleHistoryStore = createSessionStore<ScheduleHistory>('ScheduleHistoryStore', {
    undo: [],
    redo: [],
});
