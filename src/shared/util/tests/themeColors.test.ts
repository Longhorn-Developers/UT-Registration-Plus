import { getThemeColorHexByName, getThemeColorRgbByName } from '@shared/util/themeColors';
import { describe, expect, it } from 'vitest';

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
