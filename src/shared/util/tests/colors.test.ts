import { getLighterShade, hexToHSL, isValidHexColor } from '@shared/util/colors';
import { describe, expect, it } from 'vitest';

describe('hexToHSL', () => {
    it('should convert pure red to HSL', () => {
        const result = hexToHSL('#FF0000');
        expect(result).toEqual([0, 100, 50]);
    });

    it('should convert pure green to HSL', () => {
        const result = hexToHSL('#00FF00');
        expect(result).toEqual([120, 100, 50]);
    });

    it('should convert pure blue to HSL', () => {
        const result = hexToHSL('#0000FF');
        expect(result).toEqual([240, 100, 50]);
    });

    it('should convert white to HSL', () => {
        const result = hexToHSL('#FFFFFF');
        expect(result).toEqual([0, 0, 100]);
    });

    it('should convert black to HSL', () => {
        const result = hexToHSL('#000000');
        expect(result).toEqual([0, 0, 0]);
    });

    it('should convert UT burnt orange to HSL', () => {
        const result = hexToHSL('#BF5700');
        expect(result).toEqual([27, 100, 37]);
    });

    it('should convert gray to HSL', () => {
        const result = hexToHSL('#808080');
        expect(result).toEqual([0, 0, 50]);
    });

    it('should throw error for invalid hex color', () => {
        expect(() => hexToHSL('#GGGGGG')).toThrow('hexToRGB returned undefined');
    });
});

describe('isValidHexColor', () => {
    it('should validate 6-digit hex colors with hash', () => {
        expect(isValidHexColor('#000000')).toBe(true);
        expect(isValidHexColor('#FFFFFF')).toBe(true);
        expect(isValidHexColor('#BF5700')).toBe(true);
        expect(isValidHexColor('#D6D2C4')).toBe(true);
    });

    it('should validate 6-digit hex colors without hash', () => {
        expect(isValidHexColor('000000')).toBe(true);
        expect(isValidHexColor('FFFFFF')).toBe(true);
        expect(isValidHexColor('BF5700')).toBe(true);
    });

    it('should validate 3-digit hex colors with hash', () => {
        expect(isValidHexColor('#000')).toBe(true);
        expect(isValidHexColor('#FFF')).toBe(true);
        expect(isValidHexColor('#F0F')).toBe(true);
    });

    it('should validate 3-digit hex colors without hash', () => {
        expect(isValidHexColor('000')).toBe(true);
        expect(isValidHexColor('FFF')).toBe(true);
        expect(isValidHexColor('F0F')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
        expect(isValidHexColor('#')).toBe(false);
        expect(isValidHexColor('#GGG')).toBe(false);
        expect(isValidHexColor('#GGGGGG')).toBe(false);
        expect(isValidHexColor('GGGGGG')).toBe(false);
        expect(isValidHexColor('#12345')).toBe(false);
        expect(isValidHexColor('#1234567')).toBe(false);
        expect(isValidHexColor('not a color')).toBe(false);
        expect(isValidHexColor('')).toBe(false);
    });
});

describe('getLighterShade', () => {
    it('should lighten a color by default offset (20%)', () => {
        const result = getLighterShade('#BF5700');
        expect(result).toBe('#ff8624');
    });

    it('should lighten black correctly', () => {
        const result = getLighterShade('#000000');
        expect(result).toBe('#333333');
    });

    it('should not exceed 100% lightness', () => {
        const result = getLighterShade('#FFFFFF', 20);
        expect(result).toBe('#ffffff');
    });

    it('should handle custom offset values', () => {
        const result = getLighterShade('#BF5700', 40);
        expect(result).toBe('#ffbe8a');
    });

    it('should maintain hue while increasing lightness', () => {
        const result = getLighterShade('#00FF00', 20); // Pure green
        expect(result.toLowerCase()).toBe('#66ff66');
    });

    it('should throw error for invalid hex color', () => {
        expect(() => getLighterShade('#GGGGGG')).toThrow('color: Invalid hex.');
    });
});
