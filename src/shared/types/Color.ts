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
 * Checks that a block wallpaper is an inline image, so an imported file can't make the calendar load a remote URL.
 *
 * @param wallpaper - The stored wallpaper value
 * @returns True if it is a base64 image data URL
 */
export const isWallpaper = (wallpaper: unknown): wallpaper is string =>
    typeof wallpaper === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(wallpaper);

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

/**
 * Represents a HSL color value.
 */
export type HSL = [h: number, s: number, l: number];
