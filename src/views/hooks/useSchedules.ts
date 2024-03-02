import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { UserSchedule } from '@shared/types/UserSchedule';
import { useEffect, useState } from 'react';

/**
 * Custom hook that manages user schedules.
 * @returns A tuple containing the active schedule and an array of all schedules.
 */
export default function useSchedules(): [UserSchedule | null, UserSchedule[], (schedule: UserSchedule) => void] {
    const [schedules, setSchedules] = useState<UserSchedule[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeSchedule, setActiveSchedule] = useState<UserSchedule | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [storedSchedules, storedActiveIndex] = await Promise.all([
                UserScheduleStore.get('schedules'),
                UserScheduleStore.get('activeIndex'),
            ]);

            const userSchedules = storedSchedules.map(s => new UserSchedule(s));
            setSchedules(userSchedules);
            setActiveIndex(storedActiveIndex);
            setActiveSchedule(userSchedules[storedActiveIndex] || null);
        };

        fetchData();
    }, []);

    // Function to set and persist the active schedule
    const setActive = (schedule: UserSchedule) => {
        const index = schedules.findIndex(s => s.name === schedule.name);
        if (index === -1) return; // Schedule not found, exit function

        setActiveSchedule(schedule);
        setActiveIndex(index);

        // Persist changes
        UserScheduleStore.set('activeIndex', index);
    };

    return [activeSchedule, schedules, setActive];
}
