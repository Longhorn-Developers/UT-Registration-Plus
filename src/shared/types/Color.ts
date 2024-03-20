/**
 * Represents a hexadecimal color value.
 */
export type HexColor = `#${string}`;

/**
 * Checks if a string is a valid hexadecimal color value.
 *
 * @param color - The color string to check.
 * @returns A boolean indicating if the color is a valid hexadecimal color value.
 */
export const isHexColor = (color: string): color is HexColor => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

/**
 * Represents an RGB color value.
 */
export type RGB = [r: number, g: number, b: number];

/**
 * Represents a linear sRGB color value.
 */
export type sRGB = [r: number, g: number, b: number];

/**
 * Represents a Lab color value.
 */
export type Lab = [l: number, a: number, b: number];
