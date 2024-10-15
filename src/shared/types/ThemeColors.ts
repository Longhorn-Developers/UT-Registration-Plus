import type { theme } from 'unocss/preset-mini';

import type { HexColor } from './Color';

export const colors = {
    ut: {
        burntorange: '#B91C1C',
        black: '#B91C1C',
        orange: '#B91C1C',
        yellow: '#B91C1C',
        lightgreen: '#B91C1C',
        green: '#B91C1C',
        teal: '#B91C1C',
        blue: '#B91C1C',
        gray: '#B91C1C',
        offwhite: '##B91C1C',
        concrete: '#B91C1C',
        red: '#B91C1C', //   Not sure if this should be here, but it's used for remove course, and add course is ut-green
    },
    theme: {
        red: '#BF0000',
        black: '#B91C1C',
    },
} as const satisfies Record<string, Record<string, string>>;

export const extendedColors = {
    ...colors,
    gradeDistribution: {
        a: '#22C55E',
        aminus: '#A3E635',
        bplus: '#84CC16',
        b: '#FDE047',
        bminus: '#FACC15',
        cplus: '#F59E0B',
        c: '#FB923C',
        cminus: '#F97316',
        dplus: '#EF4444',
        d: '#DC2626',
        dminus: '#B91C1C',
        f: '#B91C1C',
        other: '#6B7280',
    },
} as const;

type NestedKeys<T> = {
    [K in keyof T]: T[K] extends Record<string, unknown> ? `${string & K}-${string & keyof T[K]}` : never;
}[keyof T];

/**
 * A union of all colors in the theme
 */
export type ThemeColor = NestedKeys<typeof colors>;

/**
 * Represents a Tailwind colorway: a colorway is a key in the theme.colors object that has an object as its value
 */
export type TWColorway = {
    [K in keyof typeof theme.colors]: (typeof theme.colors)[K] extends Record<string, unknown> ? K : never;
}[keyof typeof theme.colors];

/**
 * Represents the index type for accessing the theme colors based on the specified TWColorway
 */
export type TWIndex = keyof (typeof theme.colors)[TWColorway];

/**
 * Represents the colors for a course.
 */
export interface CourseColors {
    primaryColor: HexColor;
    secondaryColor: HexColor;
}

/**
 * Adjusted colorway indexes for better *quality*
 */
export const colorwayIndexes = {
    yellow: 300,
    amber: 400,
    emerald: 400,
    lime: 400,
    orange: 400,
    sky: 600,
} as const satisfies Record<string, number>;
