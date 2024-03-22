import type { HexColor } from '../types/Color';
import type { ThemeColor } from '../types/ThemeColors';
import { colors } from '../types/ThemeColors';
import { hexToRGB } from './colors';

/**
 * Flattened colors object.
 */
export const colorsFlattened: Record<ThemeColor, string> = Object.entries(colors).reduce(
    (acc: Record<ThemeColor, string>, [prefix, group]) => {
        for (const [name, hex] of Object.entries(group)) {
            acc[`${prefix}-${name}` as ThemeColor] = hex;
        }
        return acc;
    },
    {} as Record<ThemeColor, string>
);

/**
 * Represents the flattened RGB values of the colors.
 */
const colorsFlattenedRgb: Record<ThemeColor, ReturnType<typeof hexToRGB>> = Object.fromEntries(
    Object.entries(colorsFlattened).map(([name, hex]) => [name, hexToRGB(hex as HexColor)])
) as Record<ThemeColor, ReturnType<typeof hexToRGB>>;

/**
 * Retrieves the hexadecimal color value by name from the theme.
 *
 * @param name - The name of the theme color.
 * @returns The hexadecimal color value.
 */
export const getThemeColorHexByName = (name: ThemeColor): string => colorsFlattened[name];

/**
 *
 * @param name - The name of the theme color.
 * @returns An array of the red, green, and blue values, respectively
 */
export const getThemeColorRgbByName = (name: ThemeColor) => colorsFlattenedRgb[name];
