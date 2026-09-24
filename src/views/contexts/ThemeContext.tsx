import type { ThemeName } from '@shared/types/Theme';
import { createContext, useContext } from 'react';

/**
 * Context for the active theme, owned by {@link ExtensionRoot}.
 */
export interface ThemeContextValue {
    theme: ThemeName;
    setTheme: (theme: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
    theme: 'light',
    setTheme: () => {
        throw new Error('ThemeContext not initialized.');
    },
});

/**
 * @returns The active theme and a setter, scoped to the nearest {@link ExtensionRoot}.
 */
export const useTheme = () => useContext(ThemeContext);
