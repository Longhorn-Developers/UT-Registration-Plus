import { getLuminance } from '@shared/util/colors';
import { describe, expect, it } from 'vitest';

describe('getLuminance', () => {
    it('should return the correct luminance value for a given hex color', () => {
        // Test case 1: Hex color #FFFFFF (white)
        expect(getLuminance('#FFFFFF')).toBeCloseTo(1);

        // Test case 2: Hex color #000000 (black)
        expect(getLuminance('#000000')).toBeCloseTo(0);

        // Test case 3: Hex color #FF0000 (red)
        expect(getLuminance('#FF0000')).toBeCloseTo(0.2126);

        // Test case 4: Hex color #00FF00 (green)
        expect(getLuminance('#00FF00')).toBeCloseTo(0.7152);

        // Test case 5: Hex color #0000FF (blue)
        expect(getLuminance('#0000FF')).toBeCloseTo(0.0722);
    });
});
