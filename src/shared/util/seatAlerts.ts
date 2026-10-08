import { Status, type Course } from '@shared/types/Course';

export type SeatAlert = {
    uniqueId: number;
    fromStatus: Course['status'];
    toStatus: Course['status'];
};

export type WatchedSeatAlert = {
    uniqueId: number;
    label: string;
    createdAt: number;
    pending: boolean;
};

export function isSeatAlertCandidate(status: Course['status']): boolean {
    return status === Status.CLOSED || status === Status.WAITLISTED;
}

export function findSeatOpenAlerts(
    previousCourses: Pick<Course, 'uniqueId' | 'status'>[],
    nextCourses: Pick<Course, 'uniqueId' | 'status'>[],
    watchedUniqueIds: number[]
): SeatAlert[] {
    const watchedSet = new Set(watchedUniqueIds);

    return nextCourses.flatMap(course => {
        if (!watchedSet.has(course.uniqueId)) return [];

        const previous = previousCourses.find(item => item.uniqueId === course.uniqueId);
        if (!previous) return [];

        if ((previous.status === Status.WAITLISTED || previous.status === Status.CLOSED) && course.status === Status.OPEN) {
            return [{ uniqueId: course.uniqueId, fromStatus: previous.status, toStatus: course.status }];
        }

        return [];
    });
}

export function toggleSeatAlertWatch(
    watchedCourses: WatchedSeatAlert[],
    course: Pick<Course, 'uniqueId' | 'department' | 'number'>
): { watchedCourses: WatchedSeatAlert[]; isWatching: boolean } {
    const existingIndex = watchedCourses.findIndex(item => item.uniqueId === course.uniqueId);

    if (existingIndex >= 0) {
        return {
            watchedCourses: watchedCourses.filter(item => item.uniqueId !== course.uniqueId),
            isWatching: false,
        };
    }

    return {
        watchedCourses: [
            ...watchedCourses,
            {
                uniqueId: course.uniqueId,
                label: `${course.department} ${course.number}`,
                createdAt: Date.now(),
                pending: false,
            },
        ],
        isWatching: true,
    };
}

export function applySeatAlerts(
    previousCourses: Pick<Course, 'uniqueId' | 'status'>[],
    nextCourses: Pick<Course, 'uniqueId' | 'status'>[],
    watchedCourses: WatchedSeatAlert[]
): { alerts: SeatAlert[]; watchedCourses: WatchedSeatAlert[]; pendingCount: number } {
    const alerts = findSeatOpenAlerts(previousCourses, nextCourses, watchedCourses.map(course => course.uniqueId));

    if (alerts.length === 0) {
        return { alerts: [], watchedCourses, pendingCount: watchedCourses.filter(course => course.pending).length };
    }

    const nextWatchedCourses = watchedCourses.map(watchedCourse => {
        if (alerts.some(alert => alert.uniqueId === watchedCourse.uniqueId) && !watchedCourse.pending) {
            return { ...watchedCourse, pending: true };
        }

        return watchedCourse;
    });

    return {
        alerts,
        watchedCourses: nextWatchedCourses,
        pendingCount: nextWatchedCourses.filter(course => course.pending).length,
    };
}
