import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

export default async function toggleCourseVisibility(scheduleId: string, uniqueId: number): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) {
        throw new Error('Schedule not found');
    }

    const hiddenIds: number[] = schedule.hiddenCourseIds ?? [];
    const idx = hiddenIds.indexOf(uniqueId);
    if (idx === -1) {
        hiddenIds.push(uniqueId);
    } else {
        hiddenIds.splice(idx, 1);
    }
    schedule.hiddenCourseIds = hiddenIds;
    schedule.updatedAt = Date.now();

    await UserScheduleStore.set('schedules', schedules);
}
