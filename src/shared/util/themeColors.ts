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
        slate200: '#9FA8B9',
        slate300: '#7B8AA2',
        slate400: '#5C6B8B',
        slate600: '#3E4D74',
        slate700: '#2A3A56',
        grayBase: '#6B7280',
        gray200: '#9CA3AD',
        gray300: '#7B8794',
        gray400: '#5E6A78',
        gray600: '#3F4D57',
        gray700: '#2A3A42',
        stoneBase: '#78716C',
        stone200: '#A8A29E',
        stone300: '#8D8A86',
        stone400: '#736F6B',
        stone600: '#595654',
        stone700: '#433E3B',
        redBase: '#EF4444',
        red200: '#F87171',
        red300: '#FCA5A5',
        red400: '#FDB7B7',
        red600: '#DC2626',
        red700: '#B91C1C',
        orangeBase: '#F97316',
        orange200: '#FB923C',
        orange300: '#FDBA74',
        orange400: '#FED7AA',
        orange600: '#F97316',
        orange700: '#B91C1C',
        amberBase: '#F59E0B',
        amber200: '#FCD34D',
        amber300: '#FDE68A',
        amber400: '#FEEBC8',
        amber600: '#D97706',
        amber700: '#B45309',
        yellowBase: '#EAB308',
        yellow200: '#FDE047',
        yellow300: '#FEF08A',
        yellow400: '#FEF6C9',
        yellow600: '#B45309',
        yellow700: '#92400E',
        limeBase: '#84CC16',
        lime200: '#A3E635',
        lime300: '#BEF264',
        lime400: '#D9F99D',
        lime600: '#65A30D',
        lime700: '#4D7C0F',
        greenBase: '#22C55E',
        green200: '#4ADE80',
        green300: '#68EF9D',
        green400: '#8CF1B1',
        green600: '#16A34A',
        green700: '#15803D',
        emeraldBase: '#10B981',
        emerald200: '#34D399',
        emerald300: '#6EE7B7',
        emerald400: '#A7F3D0',
        emerald600: '#059669',
        emerald700: '#047857',
        tealBase: '#14B8A6',
        teal200: '#2DD4BF',
        teal300: '#5EEAD4',
        teal400: '#8CF5E6',
        teal600: '#0D9488',
        teal700: '#0F766E',
        cyanBase: '#06B6D4',
        cyan200: '#22D3EE',
        cyan300: '#5BE1F9',
        cyan400: '#87E9FD',
        cyan600: '#0598BD',
        cyan700: '#047481',
        skyBase: '#0EA5E9',
        sky200: '#3EB1D4',
        sky300: '#6CC5E0',
        sky400: '#9DD8EC',
        sky600: '#047481',
        sky700: '#03516E',
        blueBase: '#3B82F6',
        blue200: '#60A5FA',
        blue300: '#93C5FD',
        blue400: '#BFDBFE',
        blue600: '#2563EB',
        blue700: '#1D4ED8',
        indigoBase: '#6366F1',
        indigo200: '#818CF8',
        indigo300: '#A5B4FC',
        indigo400: '#C7D2FE',
        indigo600: '#4F46E5',
        indigo700: '#4338CA',
        violetBase: '#8B5CF6',
        violet200: '#A78BFA',
        violet300: '#C4B5FD',
        violet400: '#DDD6FE',
        violet600: '#7C3AED',
        violet700: '#6D28D9',
        purpleBase: '#A855F7',
        purple200: '#C084FC',
        purple300: '#D9A8FF',
        purple400: '#E9D5FF',
        purple600: '#9333EA',
        purple700: '#7E22CE',
        fuschiaBase: '#D946EF',
        fuschia200: '#E879F9',
        fuschia300: '#F0ABFC',
        fuschia400: '#F5D1FE',
        fuschia600: '#C026D3',
        fuschia700: '#9C1EAC',
        pinkBase: '#EC4899',
        pink200: '#F472B6',
        pink300: '#F9A8D4',
        pink400: '#FBCFE8',
        pink600: '#DB2777',
        pink700: '#BE185D',
        roseBase: '#F43F5E',
        rose200: '#F8718C',
        rose300: '#FCA5B7',
        rose400: '#FDB7C0',
        rose600: '#DC2626',
        rose700: '#B91C1C',
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
