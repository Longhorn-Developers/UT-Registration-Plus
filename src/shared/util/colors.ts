import { theme } from 'unocss/preset-mini';

export interface CourseColors {
    primaryColor: string;
    secondaryColor: string;
}

// calculates luminance of a hex string
function getLuminance(hex: string): number {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    [r, g, b] = [r, g, b].map(color => {
        let c = color / 255;

        c = c > 0.03928 ? ((c + 0.055) / 1.055) ** 2.4 : (c /= 12.92);

        return c;
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// calculates contrast ratio between two hex strings
function contrastRatioPair(hex1: string, hex2: string) {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);

    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

/**
 * Generate a tailwind classname for the font color based on the background color
 * @param bgColor the tailwind classname for background ex. "bg-emerald-500"
 */
export function pickFontColor(bgColor: string): 'text-white' | 'text-black' {
    return contrastRatioPair(bgColor, '#606060') > contrastRatioPair(bgColor, '#ffffff') ? 'text-black' : 'text-white';
}

/**
 * Get primary and secondary colors from a tailwind colorway
 * @param colorway the tailwind colorway ex. "emerald"
 */
export function getCourseColors(colorway: keyof typeof theme.colors, index = 600, offset = 200): CourseColors {
    return {
        primaryColor: theme.colors[colorway][index] as string,
        secondaryColor: theme.colors[colorway][index + offset] as string,
    };
}
