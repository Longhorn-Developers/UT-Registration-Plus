import { minutesToTimeInputValue, parseTimeToMinutes, sleep } from '@shared/util/time';
import { describe, expect, it } from 'vitest';

describe('parseTimeToMinutes', () => {
    it('returns minutes from midnight for padded HH:mm', () => {
        expect(parseTimeToMinutes('00:00')).toBe(0);
        expect(parseTimeToMinutes('09:30')).toBe(9 * 60 + 30);
        expect(parseTimeToMinutes('23:59')).toBe(23 * 60 + 59);
    });

    it('accepts unpadded hour when split still yields two numeric parts', () => {
        expect(parseTimeToMinutes('9:05')).toBe(9 * 60 + 5);
    });

    it('returns null for invalid or incomplete strings', () => {
        expect(parseTimeToMinutes('')).toBeNull();
        expect(parseTimeToMinutes('12')).toBeNull();
        expect(parseTimeToMinutes('abc:30')).toBeNull();
        expect(parseTimeToMinutes('12:xx')).toBeNull();
    });
});

describe('minutesToTimeInputValue', () => {
    it('pads hour and minute to two digits', () => {
        expect(minutesToTimeInputValue(0)).toBe('00:00');
        expect(minutesToTimeInputValue(9 * 60 + 5)).toBe('09:05');
        expect(minutesToTimeInputValue(23 * 60 + 59)).toBe('23:59');
    });

    it('round-trips with parseTimeToMinutes for typical day times', () => {
        for (const minutes of [0, 1, 90, 9 * 60 + 30, 23 * 60 + 59]) {
            expect(parseTimeToMinutes(minutesToTimeInputValue(minutes))).toBe(minutes);
        }
    });
});

describe('sleep', () => {
    it('should resolve after the specified number of milliseconds', async () => {
        const start = performance.now();
        const milliseconds = 1000;
        await sleep(milliseconds);
        const end = performance.now();
        const elapsed = end - start;
        // Flaky test due to JS's lack of precision in setTimeout,
        // so we allow for a 1ms difference
        expect(elapsed).toBeGreaterThanOrEqual(milliseconds - 1);
    });
});
