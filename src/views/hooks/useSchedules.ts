import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { UserSchedule } from '@shared/types/UserSchedule';
import { useEffect, useState } from 'react';

let schedulesCache = [];
let activeIndexCache = 0;
let initialLoad = true;

/**
 * Fetches the user schedules from storage and sets the cached state.
 */
async function fetchData() {
    const [storedSchedules, storedActiveIndex] = await Promise.all([
        UserScheduleStore.get('schedules'),
        UserScheduleStore.get('activeIndex'),
    ]);
    schedulesCache = storedSchedules.map(s => new UserSchedule(s));
    activeIndexCache = storedActiveIndex;
}

/**
 * Custom hook that manages user schedules.
 * @returns A tuple containing the active schedule and an array of all schedules.
 */
export default function useSchedules(): [active: UserSchedule | null, schedules: UserSchedule[]] {
    const [schedules, setSchedules] = useState<UserSchedule[]>(schedulesCache);
    const [activeIndex, setActiveIndex] = useState<number>(activeIndexCache);
    const [activeSchedule, setActiveSchedule] = useState<UserSchedule | null>(schedules[activeIndex]);

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
            setSchedules(newValue.map(s => new UserSchedule(s)));
            setActiveSchedule(new UserSchedule(newValue[activeIndex]));
        });

        const l2 = UserScheduleStore.listen('activeIndex', ({ newValue }) => {
            setActiveIndex(newValue);
            setActiveSchedule(new UserSchedule(schedules[newValue]));
        });

        return () => {
            UserScheduleStore.removeListener(l1);
            UserScheduleStore.removeListener(l2);
        };
    }, []);

    // recompute active schedule on a schedule/index change
    useEffect(() => {
        setActiveSchedule(schedules[activeIndex]);
    });

    return [activeSchedule, schedules];
}

/**
 * Switches the active schedule to the one with the specified name.
 * @param name - The name of the schedule to switch to.
 * @returns A promise that resolves when the active schedule has been switched.
 */
export async function switchSchedule(name: string): Promise<void> {
    console.log('Switching schedule...');
    const schedules = await UserScheduleStore.get('schedules');
    const activeIndex = schedules.findIndex(s => s.name === name);
    await UserScheduleStore.set('activeIndex', activeIndex);
}
