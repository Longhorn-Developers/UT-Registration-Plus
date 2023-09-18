import { Serialized } from 'chrome-extension-toolkit';
import { useEffect, useState } from 'react';
import { UserScheduleStore } from 'src/shared/storage/UserScheduleStore';
import { UserSchedule } from 'src/shared/types/UserSchedule';

export default function useSchedules(): [active: UserSchedule | null, schedules: UserSchedule[]] {
    const [schedules, setSchedules] = useState<UserSchedule[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeSchedule, setActiveSchedule] = useState<UserSchedule | null>(null);

    useEffect(() => {
        Promise.all([UserScheduleStore.get('schedules'), UserScheduleStore.get('activeIndex')]).then(
            ([schedules, activeIndex]) => {
                setSchedules(schedules.map(s => new UserSchedule(s)));
                setActiveIndex(activeIndex);
                setActiveSchedule(new UserSchedule(schedules[activeIndex]));
            }
        );

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

    return [activeSchedule, schedules];
}
