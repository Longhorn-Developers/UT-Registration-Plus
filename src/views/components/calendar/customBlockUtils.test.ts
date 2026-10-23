import { describe, expect, it } from 'vitest';

import { formatBlockTime, isBlockTimeInRange, parseBlockTime } from './customBlockUtils';

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
    it('accepts 8:00am through 9:00pm inclusive', () => {
        expect(isBlockTimeInRange(480)).toBe(true);
        expect(isBlockTimeInRange(1260)).toBe(true);
        expect(isBlockTimeInRange(465)).toBe(false);
        expect(isBlockTimeInRange(1275)).toBe(false);
    });
});
