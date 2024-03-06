import { describe, expect, it } from 'vitest';

import { formatToHHMMSS } from './utils';

describe('formatToHHMMSS', () => {
    it('should format minutes to HHMMSS format', () => {
        const minutes = 125;
        const expected = '020500';
        const result = formatToHHMMSS(minutes);
        expect(result).toBe(expected);
    });

    it('should handle single digit minutes', () => {
        const minutes = 5;
        const expected = '000500';
        const result = formatToHHMMSS(minutes);
        expect(result).toBe(expected);
    });

    it('should handle zero minutes', () => {
        const minutes = 0;
        const expected = '000000';
        const result = formatToHHMMSS(minutes);
        expect(result).toBe(expected);
    });
});
