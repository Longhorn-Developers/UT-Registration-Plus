import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { HexColor } from '@shared/types/Color';
import { UserSchedule } from '@shared/types/UserSchedule';
import { getColorwayFromColor, getCourseColors, getDarkerShade, getLighterShade } from '@shared/util/colors';
import { useEffect, useState } from 'react';

let schedulesCache: UserSchedule[] = [];
let activeIndexCache = -1;

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

export const initSchedules = fetchData;

/**
 * Custom hook that manages user schedules.
 * @returns A tuple containing the active schedule and an array of all schedules.
 */
export default function useSchedules(): [active: UserSchedule, schedules: UserSchedule[]] {
    const [schedules, setSchedules] = useState<UserSchedule[]>(schedulesCache);
    const [activeIndex, setActiveIndex] = useState<number>(activeIndexCache >= 0 ? activeIndexCache : 0);

    useEffect(() => {
        let mounted = true;

        void fetchData().then(() => {
            if (!mounted) {
                return;
            }

            setSchedules(schedulesCache);
            setActiveIndex(activeIndexCache);
        });

        const l1 = UserScheduleStore.subscribe('schedules', ({ newValue }) => {
            schedulesCache = newValue.map(s => new UserSchedule(s));
            setSchedules(schedulesCache);
        });

        const l2 = UserScheduleStore.subscribe('activeIndex', ({ newValue }) => {
            activeIndexCache = newValue >= 0 ? newValue : 0;
            setActiveIndex(activeIndexCache);
        });

        return () => {
            mounted = false;
            UserScheduleStore.unsubscribe(l1);
            UserScheduleStore.unsubscribe(l2);
        };
    }, []);

    return [schedules[activeIndex] ?? errorSchedule, schedules];
}

/**
 * Returns the active schedule.
 * @returns The active schedule.
 */
export function getActiveSchedule(): UserSchedule {
    return schedulesCache[activeIndexCache >= 0 ? activeIndexCache : 0] ?? errorSchedule;
}

/**
 * Returns the schedule with the specified id.
 * @param id - The id of the schedule to retrieve.
 * @returns The schedule with the specified id, or undefined if not found.
 */
export async function getScheduleById(id: string): Promise<UserSchedule | undefined> {
    const schedules = await UserScheduleStore.get('schedules');
    const found = schedules.find(s => s.id === id);
    if (!found) return undefined;
    // todo: this is jank
    return new UserSchedule(found);
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

/**
 * Updates the color of a course in the active schedule.
 *
 * @param courseID - The ID of the course to update.
 * @param color - The new color to set for the course.
 * @throws If the course with the given ID is not found.
 */
export async function updateCourseColors(courseID: number, primaryColor: HexColor) {
    const activeSchedule = getActiveSchedule();
    const updatedCourseIndex = activeSchedule.courses.findIndex(c => c.uniqueId === courseID);

    if (updatedCourseIndex === -1) {
        throw new Error(`Course with ID ${courseID} not found`);
    }

    const newSchedule = new UserSchedule(activeSchedule);
    const updatedCourse = newSchedule.courses[updatedCourseIndex];

    if (!updatedCourse) {
        throw new Error(`Course with ID ${courseID} not found`);
    }

    let secondaryColor: HexColor;
    try {
        const { colorway: primaryColorWay, index: primaryIndex } = getColorwayFromColor(primaryColor);
        const { secondaryColor: colorFromWay } = getCourseColors(primaryColorWay, primaryIndex, 400);

        if (!colorFromWay) {
            throw new Error('Secondary color not found');
        }

        secondaryColor = colorFromWay;
    } catch (_e) {
        secondaryColor = getDarkerShade(primaryColor, 20);

        // if primaryColor is too dark, get lighter shade instead
        if (secondaryColor === '#000000') {
            secondaryColor = getLighterShade(primaryColor, 35);
        }
    }

    updatedCourse.colors.primaryColor = primaryColor;
    updatedCourse.colors.secondaryColor = secondaryColor;
    newSchedule.courses[updatedCourseIndex] = updatedCourse;

    await replaceSchedule(activeSchedule, newSchedule);
}
