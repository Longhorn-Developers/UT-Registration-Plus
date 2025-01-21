/**
 * An object representing various spacing values used throughout the application.
 * Each key corresponds to a specific spacing size based on the 4px grid system.
 */
export const spacing = {
    'spacing-1': '0.125rem',
    'spacing-2': '0.25rem',
    'spacing-3': '0.5rem',
    'spacing-4': '0.75rem',
    'spacing-5': '1rem',
    'spacing-6': '1.25rem',
    'spacing-7': '1.5rem',
    'spacing-8': '2rem',
} as const;

type SpacingKey = keyof typeof spacing;

/**
 * Converts a spacing value from rem to pixels
 * @param key - The spacing key to convert
 * @returns The spacing value in pixels
 */
export function getSpacingInPx(key: SpacingKey): number {
    const remValue = parseFloat(spacing[key]);
    return remValue * 16; // 1rem = 16px
}
