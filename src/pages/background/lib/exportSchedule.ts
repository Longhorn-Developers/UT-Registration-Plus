import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

/**
 * Exports the provided schedule to a portable JSON
 *
 * @param scheduleId - The Id matching the to-be-exported schedule
 * @returns JSON format of the provided schedule ID, empty if one was not found
 */
export default async function exportSchedule(scheduleId: string): Promise<string | undefined> {
    try {
        const storageData = await UserScheduleStore.get('schedules');
        const selectedSchedule = storageData.find(s => s.id === scheduleId);

        if (!selectedSchedule) {
            console.warn(`Schedule ${scheduleId} does not exist`);
            return JSON.stringify({});
        }

        console.log(selectedSchedule);
        return JSON.stringify(selectedSchedule, null, 2);
    } catch (error) {
        console.error('Error getting storage data:', error);
    }
}
