/** All themes supported by the extension. Add new entries here (e.g. 'gruvbox') to extend. */
export const themes = ['light', 'dark'] as const;

export type ThemeName = (typeof themes)[number];

/** Display labels for the theme picker in Settings. */
export const themeLabels: Record<ThemeName, string> = {
    light: 'Light',
    dark: 'Dark',
};
