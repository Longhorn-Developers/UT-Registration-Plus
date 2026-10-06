import type { ThemeName } from '@shared/types/Theme';
import { useTheme } from '@views/contexts/ThemeContext';
import { useEffect } from 'react';

/**
 * Applies `theme` to the nearest {@link ThemeContext}, e.g. so a page can drive the active theme
 * from its own settings once its stores have loaded.
 */
export function useThemeSync(theme: ThemeName): void {
    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme(theme);
    }, [theme, setTheme]);
}
