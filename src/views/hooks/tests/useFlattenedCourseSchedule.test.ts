import { describe, expect, it } from 'vitest';

import { convertMinutesToIndex } from '../useFlattenedCourseSchedule';

describe('useFlattenedCourseSchedule', () => {
    it('should convert minutes to index correctly', () => {
        const minutes = 480; // 8:00 AM
        const expectedIndex = 2; // (480 - 420) / 30 = 2
        const result = convertMinutesToIndex(minutes);
        expect(result).toBe(expectedIndex);
    });
});
