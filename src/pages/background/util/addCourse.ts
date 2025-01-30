// import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
// import type { Course } from '@shared/types/Course';
// import { getUnusedColor } from '@shared/util/colors';
//
// /**
//  * Adds a course to a user's schedule.
//  *
//  * @param scheduleId - The id of the schedule to add the course to.
//  * @param course - The course to add.
//  * @param hasColor - If the course block already has colors manually set
//  * @returns A promise that resolves to void.
//  * @throws An error if the schedule is not found.
//  */
// export default async function addCourse(scheduleId: string, course: Course, hasColor = false): Promise<void> {
//     const schedules = await UserScheduleStore.get('schedules');
//     console.log('schedules', schedules);
//
//     const activeSchedule = schedules.find(s => s.id === scheduleId);
//     if (!activeSchedule) {
//         throw new Error('Schedule not found');
//     }
//
//     if (!hasColor) {
//         course.colors = getUnusedColor(activeSchedule, course);
//     }
//
//     activeSchedule.courses.push(course);
//     console.log('activeSchedule', activeSchedule);
//
//     activeSchedule.updatedAt = Date.now();
//     await UserScheduleStore.set('schedules', schedules);
//     console.log(`Course added: ${course.courseName} (ID: ${course.uniqueId})`);
//
//     const newSchedules = await UserScheduleStore.get('schedules');
//     console.log('newSchedules', newSchedules);
// }
import { MessagingProxy } from 'browser-extension-toolkit';

import type { UnifiedMessageTypes } from '../background';
import { UNIFIED_MESSAGE_TYPES } from '../background';
import type { IAddCourse } from '../handlers/UserScheduleHandler';

const proxy = new MessagingProxy<UnifiedMessageTypes>('content');

/**
 * Adds a new course via the background proxy messaging system.
 *
 * @param options - The options for the new tab.
 * @returns A promise that resolves when the tab has been opened.
 */
export async function addCourse(options: IAddCourse): Promise<void> {
    const response = await proxy.sendProxyMessage<typeof UNIFIED_MESSAGE_TYPES.SCHEDULE.ADD_COURSE, void>(
        UNIFIED_MESSAGE_TYPES.SCHEDULE.ADD_COURSE,
        options
    );

    console.log(`addCourse response: ${response}`);
    console.log(`addCourse response.data: ${response.data}`);
    console.log(`addCourse response.success: ${response.success}`);
    console.log(`addCourse response.error: ${response.error}`);

    if (!response.success) {
        throw new Error(`Failed to open tab: ${response.error}`);
    }

    if (!response.data) {
        throw new Error('Tab ID was not returned');
    }
}
