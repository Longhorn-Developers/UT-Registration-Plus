import { describe, expect, it } from 'vitest';

import { GRID_DEFAULT_START, convertMinutesToIndex } from '../useFlattenedCourseSchedule';

describe('useFlattenedCourseSchedule', () => {
    describe('convertMinutesToIndex', () => {
        it('should use 8 AM as the default grid start', () => {
            const minutes = 480; // 8:00 AM
            // (480 - 480) / 30 + 2 + 1 = 3
            expect(convertMinutesToIndex(minutes)).toBe(3);
        });

        it('should adjust index when a course starts before 8 AM (dynamic start)', () => {
            const gridStart = 360; // 6:00 AM — pushed back by an early course
            const minutes = 480; // 8:00 AM course
            // (480 - 360) / 30 + 2 + 1 = 7
            expect(convertMinutesToIndex(minutes, gridStart)).toBe(7);
        });

        it('should index a 6 AM course at row 3 when grid starts at 6 AM', () => {
            const gridStart = 360; // 6:00 AM
            const minutes = 360; // 6:00 AM course
            // (360 - 360) / 30 + 2 + 1 = 3
            expect(convertMinutesToIndex(minutes, gridStart)).toBe(3);
        });

        it('should use GRID_DEFAULT_START as the default parameter', () => {
            expect(convertMinutesToIndex(GRID_DEFAULT_START)).toBe(3);
        });
    });
});
