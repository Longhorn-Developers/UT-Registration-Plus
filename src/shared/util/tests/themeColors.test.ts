import { getThemeColorHexByName, getThemeColorRgbByName, hexToRgb } from '@shared/util/themeColors';
import { describe, expect, it } from 'vitest';

describe('hexToRgb', () => {
    it('should convert hex color to RGB', () => {
        expect(hexToRgb('#BF5700')).toEqual([191, 87, 0]);
        expect(hexToRgb('#333F48')).toEqual([51, 63, 72]);
        expect(hexToRgb('#f8971f')).toEqual([248, 151, 31]);
        expect(hexToRgb('#ffd600')).toEqual([255, 214, 0]);
        expect(hexToRgb('#a6cd57')).toEqual([166, 205, 87]);
        expect(hexToRgb('#579d42')).toEqual([87, 157, 66]);
        expect(hexToRgb('#00a9b7')).toEqual([0, 169, 183]);
        expect(hexToRgb('#005f86')).toEqual([0, 95, 134]);
        expect(hexToRgb('#9cadb7')).toEqual([156, 173, 183]);
        expect(hexToRgb('#d6d2c4')).toEqual([214, 210, 196]);
        expect(hexToRgb('#95a5a6')).toEqual([149, 165, 166]);
        expect(hexToRgb('#B91C1C')).toEqual([185, 28, 28]);
        expect(hexToRgb('#af2e2d')).toEqual([175, 46, 45]);
        expect(hexToRgb('#1a2024')).toEqual([26, 32, 36]);
        expect(hexToRgb('#22c55e')).toEqual([34, 197, 94]);
        expect(hexToRgb('#a3e635')).toEqual([163, 230, 53]);
        expect(hexToRgb('#84CC16')).toEqual([132, 204, 22]);
        expect(hexToRgb('#FDE047')).toEqual([253, 224, 71]);
        expect(hexToRgb('#FACC15')).toEqual([250, 204, 21]);
        expect(hexToRgb('#F59E0B')).toEqual([245, 158, 11]);
        expect(hexToRgb('#FB923C')).toEqual([251, 146, 60]);
        expect(hexToRgb('#F97316')).toEqual([249, 115, 22]);
        expect(hexToRgb('#EA580C')).toEqual([234, 88, 12]);
        expect(hexToRgb('#DC2626')).toEqual([220, 38, 38]);
        expect(hexToRgb('#B91C1C')).toEqual([185, 28, 28]);
    });
});

describe('getThemeColorHexByName', () => {
    it('should return the hex color value by name', () => {
        expect(getThemeColorHexByName('ut-burntorange')).toEqual('#BF5700');
        expect(getThemeColorHexByName('ut-offwhite')).toEqual('#D6D2C4');
        expect(getThemeColorHexByName('ut-black')).toEqual('#333F48');
        // Add more test cases for other theme color names
    });
});

describe('getThemeColorRgbByName', () => {
    it('should return the RGB color value by name', () => {
        expect(getThemeColorRgbByName('ut-burntorange')).toEqual([191, 87, 0]);
        expect(getThemeColorRgbByName('ut-offwhite')).toEqual([214, 210, 196]);
        expect(getThemeColorRgbByName('ut-black')).toEqual([51, 63, 72]);
        // Add more test cases for other theme color names
    });
});
