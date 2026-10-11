import { describe, expect, it } from 'vitest';

import { findSeatOpenAlerts } from '../seatAlerts';
import { Status } from '@shared/types/Course';

describe('findSeatOpenAlerts', () => {
    it('returns an alert when a watched course changes from waitlisted to open', () => {
        const previousCourses = [{ uniqueId: 123, status: Status.WAITLISTED }];
        const nextCourses = [{ uniqueId: 123, status: Status.OPEN }];

        expect(findSeatOpenAlerts(previousCourses, nextCourses, [123])).toEqual([
            expect.objectContaining({ uniqueId: 123, fromStatus: Status.WAITLISTED, toStatus: Status.OPEN }),
        ]);
    });

    it('does not alert for courses that were already open', () => {
        const previousCourses = [{ uniqueId: 123, status: Status.OPEN }];
        const nextCourses = [{ uniqueId: 123, status: Status.OPEN }];

        expect(findSeatOpenAlerts(previousCourses, nextCourses, [123])).toEqual([]);
    });

    it('does not alert for unwatched courses', () => {
        const previousCourses = [{ uniqueId: 123, status: Status.WAITLISTED }];
        const nextCourses = [{ uniqueId: 123, status: Status.OPEN }];

        expect(findSeatOpenAlerts(previousCourses, nextCourses, [])).toEqual([]);
    });
});
