import { createLocalStore, debugStore } from 'chrome-extension-toolkit';
import { Course } from 'src/shared/types/Course';
/**
 * A store that is used for storing user options
 */
interface IUserScheduleStore {
    current: string;
    schedules: {
        [id: string]: Course[];
    };
}

interface Actions {
    createSchedule(name: string): Promise<void>;
    addCourseToSchedule(name: string, course: Course): Promise<void>;
    removeCourseFromSchedule(name: string, course: Course): Promise<void>;
    removeSchedule(name: string): Promise<void>;
    getSchedule(name: string): Promise<Course[] | undefined>;
}

const UserScheduleStore = createLocalStore<IUserScheduleStore, Actions>(
    {
        current: 'Schedule 1',
        schedules: {},
    },
    store => ({
        async createSchedule(name: string) {
            const schedules = await store.getSchedules();
            if (!schedules[name]) {
                schedules[name] = [];
                await store.setSchedules(schedules as any);
            }
        },
        async removeSchedule(name: string) {
            const schedules = await store.getSchedules();
            delete schedules[name];
            await store.setSchedules(schedules);
        },
        async getSchedule(name) {
            const schedules = await store.getSchedules();
            return schedules[name]?.map(course => new Course(course));
        },
        async addCourseToSchedule(name, course) {
            const schedules = await store.getSchedules();
            const scheduleToEdit = schedules[name];
            if (scheduleToEdit) {
                scheduleToEdit.push(course);
                await store.setSchedules(schedules);
            }
        },
        async removeCourseFromSchedule(name, course) {
            const schedules = await store.getSchedules();
            const scheduleToEdit = schedules[name];
            if (scheduleToEdit) {
                schedules[name] = scheduleToEdit.filter(c => c.uniqueId !== course.uniqueId);
                await store.setSchedules(schedules);
            }
        },
    })
);

debugStore({ UserScheduleStore });
