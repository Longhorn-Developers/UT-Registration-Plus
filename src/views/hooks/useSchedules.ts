import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { UserSchedule } from '@shared/types/UserSchedule';
import { useEffect, useState } from 'react';

/**
 * Custom hook that manages user schedules.
 * @returns A tuple containing the active schedule and an array of all schedules.
 */
export default function useSchedules(): [active: UserSchedule | null, schedules: UserSchedule[]] {
    const [schedules, setSchedules] = useState<UserSchedule[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeSchedule, setActiveSchedule] = useState<UserSchedule | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [storedSchedules, storedActiveIndex] = await Promise.all([
                UserScheduleStore.get('schedules'),
                UserScheduleStore.get('activeIndex'),
            ]);
            setSchedules(storedSchedules.map(s => new UserSchedule(s)));
            setActiveIndex(storedActiveIndex);
            setActiveSchedule(new UserSchedule(storedSchedules[storedActiveIndex]));

            const initializable = UserScheduleStore.initialize();

            if (initializable) {
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
            }
        };

        fetchData();
    }, []);

    return [activeSchedule, schedules];
}