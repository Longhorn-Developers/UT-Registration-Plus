import { Serialized } from 'chrome-extension-toolkit';
import { useEffect, useState } from 'react';
import { userScheduleStore } from 'src/shared/storage/UserScheduleStore';
import { UserSchedule } from 'src/shared/types/UserSchedule';

export default function useUserSchedules(): UserSchedule[] {
    const [schedules, setSchedules] = useState<UserSchedule[]>([]);

    useEffect(() => {
        function updateSchedules(schedules: Serialized<UserSchedule>[]) {
            setSchedules(schedules.map(s => new UserSchedule(s)));
        }

        userScheduleStore.get('schedules').then(updateSchedules);

        const listener = userScheduleStore.listen('schedules', ({ newValue }) => {
            updateSchedules(newValue);
        });

        return () => {
            userScheduleStore.removeListener(listener);
        };
    }, []);

    return schedules;
}
