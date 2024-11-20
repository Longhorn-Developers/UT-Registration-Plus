import type { theme } from 'unocss/preset-mini';

import type { HexColor } from './Color';

export const colors = {
    ut: {
        burntorange: '#BF5700',
        black: '#333F48',
        orange: '#F8971F',
        yellow: '#FFD600',
        lightgreen: '#A6CD57',
        green: '#579D42',
        teal: '#00A9B7',
        blue: '#005F86',
        gray: '#9CADB7',
        offwhite: '#D6D2C4',
        concrete: '#95A5A6',
    },
    theme: {
        red: '#D10000',
        black: '#1A2024',
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
