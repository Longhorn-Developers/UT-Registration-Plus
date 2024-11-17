import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

/**
 * Exports the provided schedule to a portable JSON
 *
 * @param scheduleId - The Id matching the to-be-exported schedule
 */
export default async function exportSchedule(scheduleId: string): Promise<string | undefined> {
    try {
        const storageData = await UserScheduleStore.get('schedules');
        const selectedSchedule = storageData.find(s => s.id === scheduleId);

        if (!selectedSchedule) {
            throw new Error(`Schedule ${scheduleId} does not exist`);
        }

        console.log(selectedSchedule);
        return JSON.stringify(selectedSchedule);
    } catch (error) {
        console.error('Error getting storage data:', error);
    }
}
