import {
    CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END,
    CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END_MINUTES,
    CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START,
    CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START_MINUTES,
} from '@shared/util/customTimeBlocks';
import { parseTimeToMinutes } from '@shared/util/time';
import { describe, expect, it } from 'vitest';

describe('custom time block all-day input defaults', () => {
    it('uses eight-to-nine AM as the display range for disabled time inputs', () => {
        expect(CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START_MINUTES).toBe(480);
        expect(CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END_MINUTES).toBe(9 * 60);
        expect(parseTimeToMinutes(CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START)).toBe(8 * 60);
        expect(parseTimeToMinutes(CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END)).toBe(9 * 60);
    });
});
