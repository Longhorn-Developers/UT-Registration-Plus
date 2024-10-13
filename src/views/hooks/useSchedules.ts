import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { UserSchedule } from '@shared/types/UserSchedule';
import { useEffect, useState } from 'react';

let schedulesCache: UserSchedule[] = [];
let activeIndexCache = -1;
let initialLoad = true;

const errorSchedule = new UserSchedule({
    courses: [],
    id: 'error',
    name: 'No Schedule Selected',
    hours: 0,
    updatedAt: Date.now(),
});

/**
 * Fetches the user schedules from storage and sets the cached state.
 */
async function fetchData() {
    const [storedSchedules, storedActiveIndex] = await Promise.all([
        UserScheduleStore.get('schedules'),
        UserScheduleStore.get('activeIndex'),
    ]);
    schedulesCache = storedSchedules.map(s => new UserSchedule(s));
    activeIndexCache = storedActiveIndex >= 0 ? storedActiveIndex : 0;
}

/**
 * Custom hook that manages user schedules.
 * @returns A tuple containing the active schedule and an array of all schedules.
 */
export default function useSchedules(): [active: UserSchedule, schedules: UserSchedule[]] {
    const [schedules, setSchedules] = useState<UserSchedule[]>(schedulesCache);
    const [activeIndex, setActiveIndex] = useState<number>(activeIndexCache);
    const [activeSchedule, setActiveSchedule] = useState<UserSchedule>(schedules[activeIndex] ?? errorSchedule);

    if (initialLoad) {
        initialLoad = false;

        // trigger suspense
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw new Promise(res => {
            fetchData().then(res);
        });
    }

    useEffect(() => {
        const l1 = UserScheduleStore.listen('schedules', ({ newValue }) => {
            schedulesCache = newValue.map(s => new UserSchedule(s));
            setSchedules(schedulesCache);
        });

        const l2 = UserScheduleStore.listen('activeIndex', ({ newValue }) => {
            activeIndexCache = newValue;
            setActiveIndex(newValue);
        });

        return () => {
            UserScheduleStore.removeListener(l1);
            UserScheduleStore.removeListener(l2);
        };
    }, []);

    // recompute active schedule on a schedule/index change
    useEffect(() => {
        setActiveSchedule(schedules[activeIndex] ?? errorSchedule);
    }, [activeIndex, schedules]);

    return [activeSchedule, schedules];
}

/**
 * Returns the active schedule.
 * @returns The active schedule.
 */
export function getActiveSchedule(): UserSchedule {
    return schedulesCache[activeIndexCache] ?? errorSchedule;
}

/**
 * Replaces the old schedule with the new schedule.
 * @param oldSchedule - The old schedule to be replaced.
 * @param newSchedule - The new schedule to replace the old schedule.
 */
export async function replaceSchedule(oldSchedule: UserSchedule, newSchedule: UserSchedule) {
    const schedules = await UserScheduleStore.get('schedules');
    let oldIndex = schedules.findIndex(s => s.id === oldSchedule.id);
    oldIndex = oldIndex !== -1 ? oldIndex : 0;
    schedules[oldIndex] = newSchedule;
    await UserScheduleStore.set('schedules', schedules);
    console.log('schedule replaced');
}

/**
 * Switches the active schedule to the one with the specified id.
 * @param id - The id of the schedule to switch to.
 * @returns A promise that resolves when the active schedule has been switched.
 */
export async function switchSchedule(id: string): Promise<void> {
    console.log('Switching schedule...');
    const schedules = await UserScheduleStore.get('schedules');
    const activeIndex = schedules.findIndex(s => s.id === id);
    await UserScheduleStore.set('activeIndex', activeIndex);
}

/**
 * Switches the active schedule to the one with the specified name.
 * @param name - The name of the schedule to switch to.
 * @returns A promise that resolves when the active schedule has been switched.
 */
export async function switchScheduleByName(name: string): Promise<void> {
    console.log('Switching schedule...');
    const schedules = await UserScheduleStore.get('schedules');
    const activeIndex = schedules.findIndex(s => s.name === name);
    await UserScheduleStore.set('activeIndex', activeIndex);
}
