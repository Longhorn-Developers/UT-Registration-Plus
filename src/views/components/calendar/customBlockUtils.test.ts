import { describe, expect, it } from 'vitest';

import { formatBlockTime, isBlockTimeInRange, minuteAtPosition, parseBlockTime } from './customBlockUtils';

describe('parseBlockTime', () => {
    it('parses 12-hour and 24-hour times, rounding to 15 minutes', () => {
        expect(parseBlockTime('8:00am')).toBe(480);
        expect(parseBlockTime('1:15 PM')).toBe(795);
        expect(parseBlockTime('13:07')).toBe(780);
    });

    it('rejects malformed times', () => {
        expect(parseBlockTime('')).toBeNull();
        expect(parseBlockTime('13:00pm')).toBeNull();
        expect(parseBlockTime('8am')).toBeNull();
    });

    it('does not clamp times outside the grid to its bounds', () => {
        expect(parseBlockTime('2:00am')).toBe(120);
        expect(parseBlockTime('11:00pm')).toBe(1380);
        expect(formatBlockTime(120)).toBe('2:00am');
    });
});

describe('isBlockTimeInRange', () => {
    it('accepts times within the grid bounds inclusive', () => {
        expect(isBlockTimeInRange(480, 480, 1260)).toBe(true);
        expect(isBlockTimeInRange(1260, 480, 1260)).toBe(true);
        expect(isBlockTimeInRange(465, 480, 1260)).toBe(false);
        expect(isBlockTimeInRange(1275, 480, 1260)).toBe(false);
    });

    it('follows a grid extended for early courses', () => {
        expect(isBlockTimeInRange(360, 360, 1260)).toBe(true);
        expect(isBlockTimeInRange(345, 360, 1260)).toBe(false);
    });
});

describe('minuteAtPosition', () => {
    it('snaps to the grid bounds rather than 8:00am – 9:00pm', () => {
        expect(minuteAtPosition(0, 900, 360, 1260)).toBe(360);
        expect(minuteAtPosition(900, 900, 360, 1320)).toBe(1320);
        expect(minuteAtPosition(-50, 900, 360, 1260)).toBe(360);
    });
});
