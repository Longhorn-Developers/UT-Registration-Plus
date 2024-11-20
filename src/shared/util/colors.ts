import type { Serialized } from 'chrome-extension-toolkit';
import { theme } from 'unocss/preset-mini';

import type { HexColor, Lab, RGB, sRGB } from '../types/Color';
import { isHexColor } from '../types/Color';
import type { Course } from '../types/Course';
import type { CourseColors, TWColorway, TWIndex } from '../types/ThemeColors';
import { colorwayIndexes } from '../types/ThemeColors';
import type { UserSchedule } from '../types/UserSchedule';

/**
 * Converts a hexadecimal color value to RGB format. (adapted from https://stackoverflow.com/a/5624139/8022866)
 *
 * @param hex - The hexadecimal color value.
 * @returns An array containing the RGB values.
 */
export function hexToRGB(hex: HexColor): RGB | undefined {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const parsedHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(parsedHex);

    if (!result || !(result.length > 3)) return undefined;

    return [parseInt(result[1]!, 16), parseInt(result[2]!, 16), parseInt(result[3]!, 16)];
}

export const useableColorways = Object.keys(theme.colors)
    // check that the color is a colorway (is an object)
    .filter(color => typeof theme.colors[color as keyof typeof theme.colors] === 'object')
    .slice(0, 17) as TWColorway[];

/**
 * Generate a Tailwind classname for the font color based on the background color
 *
 * @param bgColor - The hex color of the background
 * @returns The Tailwind classname for the font color
 */
export function pickFontColor(bgColor: HexColor): 'text-white' | 'text-black' | 'text-theme-black' {
    const coefficients = [0.2126729, 0.7151522, 0.072175] as const;

    const flipYs = 0.342; // based on APCA™ 0.98G middle contrast BG color

    const trc = 2.4; // 2.4 exponent for emulating actual monitor perception
    const rgb = hexToRGB(bgColor);
    if (!rgb) throw new Error('bgColor: Invalid hex.');

    // coefficients and rgb are both 3 elements long, so this is safe
    let Ys = rgb.reduce((acc, c, i) => acc + (c / 255.0) ** trc * coefficients[i]!, 0);

    if (Ys < flipYs) {
        return 'text-white';
    }

    return Ys < 0.365 ? 'text-black' : 'text-theme-black';
}

/**
 * Get primary and secondary colors from a Tailwind colorway
 *
 * @param colorway - The Tailwind colorway ex. "emerald"
 * @param index - The index of the primary color in the colorway
 * @param offset - The offset to get the secondary color
 * @returns The primary and secondary colors
 */
export function getCourseColors(colorway: TWColorway, index?: number, offset: number = 300): CourseColors {
    if (index === undefined) {
        // eslint-disable-next-line no-param-reassign
        index = colorway in colorwayIndexes ? colorwayIndexes[colorway as keyof typeof colorwayIndexes] : 500;
    }

    return {
        primaryColor: theme.colors[colorway][index as TWIndex] as HexColor,
        secondaryColor: theme.colors[colorway][(index + offset) as TWIndex] as HexColor,
    };
}

/**
 * Get the Tailwind colorway from a given color.
 *
 * @param color - The hexadecimal color value.
 * @returns The Tailwind colorway.
 */
export function getColorwayFromColor(color: HexColor): TWColorway {
    for (const colorway of useableColorways) {
        if (Object.values(theme.colors[colorway]).includes(color)) {
            return colorway as TWColorway;
        }
    }

    // not a direct match, get the closest color
    let closestColor = '';
    let closestDistance = Infinity;

    for (const colorway of useableColorways) {
        for (const [shade, shadeColor] of Object.entries(theme.colors[colorway])) {
            // type guard
            if (!isHexColor(shadeColor)) {
                continue;
            }

            const shadeColorRGB = hexToRGB(shadeColor);
            if (!shadeColorRGB) {
                continue;
            }

            const distance = oklabDistance(rgbToOKlab(shadeColorRGB), rgbToOKlab(shadeColorRGB));
            if (distance < closestDistance) {
                closestDistance = distance;
                closestColor = shade;
            }
        }
    }

    // type guard
    if (!isHexColor(closestColor)) {
        throw new Error("closestColor isn't a valid hex color");
    }

    return getColorwayFromColor(closestColor);
}

/**
 * Get next unused color in a tailwind colorway for a given schedule
 *
 * @param schedule - The schedule which the course is in
 * @param course - The course to get the color for
 * @param index - The index of the primary color in the colorway
 * @param offset - The offset to get the secondary color
 * @returns The primary and secondary colors
 */
export function getUnusedColor(
    schedule: Serialized<UserSchedule>,
    course: Course,
    index?: number,
    offset?: number
): CourseColors {
    // strategy: First, check if any of the course's in schedule have the same department as the current course,
    // if so, use a colorway near the color of that course if possible.
    // Otherwise, find a colorway that is not used in the schedule and at least two hues away from any other color in the schedule.

    // wrapping helper functions
    function getPreviousColorway(colorway: TWColorway): TWColorway {
        const colorwayIndex = useableColorways.indexOf(colorway);
        return useableColorways[(colorwayIndex - 1 + useableColorways.length) % useableColorways.length] as TWColorway;
    }

    function getNextColorway(colorway: TWColorway): TWColorway {
        const colorwayIndex = useableColorways.indexOf(colorway);
        return useableColorways[(colorwayIndex + 1) % useableColorways.length] as TWColorway;
    }

    const scheduleCourses = schedule.courses.map(c => ({
        ...c,
        colorway: getColorwayFromColor(c.colors.primaryColor),
    }));
    const usedColorways = new Set(scheduleCourses.map(c => c.colorway));
    const availableColorways = new Set(useableColorways.filter(c => !usedColorways.has(c)));

    if (availableColorways.size > 0) {
        let sameDepartment = scheduleCourses.filter(c => c.department === course.department);

        sameDepartment.sort((a, b) => {
            const aIndex = useableColorways.indexOf(a.colorway);
            const bIndex = useableColorways.indexOf(b.colorway);

            return aIndex - bIndex;
        });

        if (sameDepartment.length > 0) {
            // check to see if any adjacent colorways are available
            const centerCourse = sameDepartment[Math.floor(Math.random() * sameDepartment.length)]!;

            let nextColorway = getNextColorway(centerCourse.colorway);
            let prevColorway = getPreviousColorway(centerCourse.colorway);

            // eslint-disable-next-line no-constant-condition
            while (true) {
                if (availableColorways.has(nextColorway)) {
                    return getCourseColors(nextColorway, index, offset);
                }
                if (availableColorways.has(prevColorway)) {
                    return getCourseColors(prevColorway, index, offset);
                }

                nextColorway = getNextColorway(nextColorway);
                prevColorway = getPreviousColorway(prevColorway);
            }
        }

        const shortenedColorways = new Set(availableColorways);
        // no courses in the same department, restrict colorways to those which are at least 2 indexes away from any used colors
        for (const colorway of usedColorways) {
            shortenedColorways.delete(getPreviousColorway(colorway));
            shortenedColorways.delete(getNextColorway(colorway));
        }

        if (shortenedColorways.size > 0) {
            // TODO: make this go by 3's to leave future spaces open
            const randomColorway = Array.from(shortenedColorways)[Math.floor(Math.random() * shortenedColorways.size)]!;

            return getCourseColors(randomColorway, index, offset);
        }
        // no colorways are at least 2 indexes away from any used colors, just get a random colorway
        const randomColorway: TWColorway | undefined =
            Array.from(availableColorways)[Math.floor(Math.random() * availableColorways.size)];

        if (!randomColorway) {
            throw new Error('randomColorway is undefined');
        }

        return getCourseColors(randomColorway, index, offset);
    }
    // TODO: get just a random color idk
    return getCourseColors('emerald', index, offset);
}

// OKLab helper functions (https://github.com/bottosson/bottosson.github.io/blob/master/misc/colorpicker/colorconversion.js)
// function srgbTransferFunction(a: number): number {
//     return a <= 0.0031308 ? 12.92 * a : 1.055 * a ** 0.4166666666666667 - 0.055;
// }

function srgbTransferFunctionInv(a: number): number {
    return a > 0.04045 ? ((a + 0.055) / 1.055) ** 2.4 : a / 12.92;
}

function rgbToSrgb(rgb: RGB): sRGB {
    return rgb.map(c => srgbTransferFunctionInv(c / 255)) as sRGB;
}

/**
 * Convert an RGB color to the OKLab color space
 *
 * @param rgb - The RGB color
 * @returns The color in the OKLab color space
 */
function srgbToOKlab([r, g, b]: sRGB): Lab {
    let l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    let m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    let s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

    let lc = Math.cbrt(l);
    let mc = Math.cbrt(m);
    let sc = Math.cbrt(s);

    return [
        0.2104542553 * lc + 0.793617785 * mc - 0.0040720468 * sc,
        1.9779984951 * lc - 2.428592205 * mc + 0.4505937099 * sc,
        0.0259040371 * lc + 0.7827717662 * mc - 0.808675766 * sc,
    ];
}

function rgbToOKlab(rgb: RGB): Lab {
    return srgbToOKlab(rgbToSrgb(rgb));
}

/**
 * Calculate the distance between two colors in the OKLab color space
 */
function oklabDistance([l1, a1, b1]: Lab, [l2, a2, b2]: Lab): number {
    return Math.sqrt((l2 - l1) ** 2 + (a2 - a1) ** 2 + (b2 - b1) ** 2);
}
