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
        red: '#B91C1C', //   Not sure if this should be here, but it's used for remove course, and add course is ut-green
        white: '#FFFFFF',
    },
    theme: {
        red: '#AF2E2D',
        black: '#1A2024',
    },
    gradeDistribution: {
        a: '#22C55E',
        aminus: '#A3E635',
        bplus: '#84CC16',
        b: '#FDE047',
        bminus: '#FACC15',
        cplus: '#F59E0B',
        c: '#FB923C',
        cminus: '#F97316',
        dplus: '#EA580C', // TODO (achadaga): copilot generated, get actual color from Isaiah
        d: '#DC2626',
        dminus: '#B91C1C',
        f: '#B91C1C',
    },
    palette: {
        slateBase: '#64748B',
        slate200: '#e2e8f0',
        slate300: '#cbd5e1',
        slate400: '#94a3b8',
        slate600: '#475569',
        slate700: '#334155',
        grayBase: '#6b7280',
        gray200: '#e5e7eb',
        gray300: '#d1d5db',
        gray400: '#9ca3af',
        gray600: '#4b5563',
        gray700: '#374151',
        stoneBase: '#78716c',
        stone200: '#e7e5e4',
        stone300: '#d6d3d1',
        stone400: '#a8a29e',
        stone600: '#57534e',
        stone700: '#44403c',
        redBase: '#ef4444',
        red200: '#fecaca',
        red300: '#fca5a5',
        red400: '#f87171',
        red600: '#dc2626',
        red700: '#b91c1c',
        orangeBase: '#f97316',
        orange200: '#fed7aa',
        orange300: '#fdba74',
        orange400: '#fb923c',
        orange600: '#ea580c',
        orange700: '#c2410c',
        amberBase: '#f59e0b',
        amber200: '#fde68a',
        amber300: '#fcd34d',
        amber400: '#fbbf24',
        amber600: '#d97706',
        amber700: '#b45309',
        yellowBase: '#eab308',
        yellow200: '#fef08a',
        yellow300: '#fde047',
        yellow400: '#facc15',
        yellow600: '#ca8a04',
        yellow700: '#a16207',
        limeBase: '#84cc16',
        lime200: '#d9f99d',
        lime300: '#bef264',
        lime400: '#a3e635',
        lime600: '#65a30d',
        lime700: '#4d7c0f',
        greenBase: '#22c55e',
        green200: '#bbf7d0',
        green300: '#86efac',
        green400: '#4ade80',
        green600: '#16a34a',
        green700: '#15803d',
        emeraldBase: '#10b981',
        emerald200: '#a7f3d0',
        emerald300: '#6ee7b7',
        emerald400: '#34d399',
        emerald600: '#059669',
        emerald700: '#047857',
        tealBase: '#14b8a6',
        teal200: '#99f6e4',
        teal300: '#5eead4',
        teal400: '#2dd4bf',
        teal600: '#0d9488',
        teal700: '#0f766e',
        cyanBase: '#06b6d4',
        cyan200: '#a5f3fc',
        cyan300: '#67e8f9',
        cyan400: '#22d3ee',
        cyan600: '#0891b2',
        cyan700: '#0e7490',
        skyBase: '#0ea5e9',
        sky200: '#bae6fd',
        sky300: '#7dd3fc',
        sky400: '#38bdf8',
        sky600: '#0284c7',
        sky700: '#0369a1',
        blueBase: '#3b82f6',
        blue200: '#bfdbfe',
        blue300: '#93c5fd',
        blue400: '#60a5fa',
        blue600: '#2563eb',
        blue700: '#1d4ed8',
        indigoBase: '#6366f1',
        indigo200: '#c7d2fe',
        indigo300: '#a5b4fc',
        indigo400: '#818cf8',
        indigo600: '#4f46e5',
        indigo700: '#4338ca',
        violetBase: '#8b5cf6',
        violet200: '#ddd6fe',
        violet300: '#c4b5fd',
        violet400: '#a78bfa',
        violet600: '#7c3aed',
        violet700: '#6d28d9',
        purpleBase: '#a855f7',
        purple200: '#e9d5ff',
        purple300: '#d8b4fe',
        purple400: '#c084fc',
        purple600: '#9333ea',
        purple700: '#7e22ce',
        fuschiaBase: '#d946ef',
        fuschia200: '#f5d0fe',
        fuschia300: '#f0abfc',
        fuschia400: '#e879f9',
        fuschia600: '#c026d3',
        fuschia700: '#a21caf',
        pinkBase: '#ec4899',
        pink200: '#fbcfe8',
        pink300: '#f9a8d4',
        pink400: '#f472b6',
        pink600: '#db2777',
        pink700: '#be185d',
        roseBase: '#f43f5e',
        rose200: '#fecdd3',
        rose300: '#fda4af',
        rose400: '#fb7185',
        rose600: '#e11d48',
        rose700: '#be123c',
    },
} as const satisfies Record<string, Record<string, string>>;

type NestedKeys<T> = {
    [K in keyof T]: T[K] extends Record<string, any> ? `${string & K}-${string & keyof T[K]}` : never;
}[keyof T];

/**
 * A union of all colors in the theme
 */
export type ThemeColor = NestedKeys<typeof colors>;

/**
 * Flattened colors object.
 * @type {Record<ThemeColor, string>}
 */
export const colorsFlattened = Object.entries(colors).reduce(
    (acc, [prefix, group]) => {
        for (const [name, hex] of Object.entries(group)) {
            acc[`${prefix}-${name}`] = hex;
        }
        return acc;
    },
    {} as Record<ThemeColor, string>
);

/**
 * Converts a hexadecimal color code to an RGB color array.
 * @param hex The hexadecimal color code to convert.
 * @returns An array representing the RGB color values.
 */
export const hexToRgb = (hex: string) =>
    hex.match(/[0-9a-f]{2}/gi).map(partialHex => parseInt(partialHex, 16)) as [number, number, number];

/**
 * Represents the flattened RGB values of the colors.
 * @type {Record<ThemeColor, ReturnType<typeof hexToRgb>>}
 */
const colorsFlattenedRgb = Object.fromEntries(
    Object.entries(colorsFlattened).map(([name, hex]) => [name, hexToRgb(hex)])
) as Record<ThemeColor, ReturnType<typeof hexToRgb>>;

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
