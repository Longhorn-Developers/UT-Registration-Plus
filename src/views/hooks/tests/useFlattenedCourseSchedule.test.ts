import { describe, expect, it } from 'vitest';

import { convertMinutesToIndex } from '../useFlattenedCourseSchedule';

describe('useFlattenedCourseSchedule', () => {
    it('should convert minutes to index correctly', () => {
        const minutes = 480; // 8:00 AM
        const expectedIndex = 7; // (480 - 360) / 30 + 2 + 1 = 7
        const result = convertMinutesToIndex(minutes);
        expect(result).toBe(expectedIndex);
    });
});
