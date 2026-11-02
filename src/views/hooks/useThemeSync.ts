import type { ThemeName } from '@shared/types/Theme';
import { useTheme } from '@views/contexts/ThemeContext';
import { useLayoutEffect } from 'react';

/**
 * Applies `theme` to the nearest {@link ThemeContext}, e.g. so a page can drive the active theme
 * from its own settings once its stores have loaded.
 */
export function useThemeSync(theme: ThemeName): void {
    const { setTheme } = useTheme();

    // Layout effect, so the first paint already uses the page's theme instead of flashing light
    useLayoutEffect(() => {
        setTheme(theme);
    }, [theme, setTheme]);
}
