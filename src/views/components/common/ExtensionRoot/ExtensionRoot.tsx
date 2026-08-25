// biome-ignore assist/source/organizeImports: react-scan must be imported before React and React DOM
import { scan } from 'react-scan';

import type { ThemeName } from '@shared/types/Theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SentryProvider from '@views/contexts/SentryContext';
import { ThemeContext, useTheme } from '@views/contexts/ThemeContext';
import React from 'react';

import ShadowRootContainer from './ShadowRootContainer';

export { styleResetClass } from './ShadowRootContainer';

const queryClient = new QueryClient();

if (import.meta.env.DEV)
    scan({
        showFPS: false,
    });

/**
 * A wrapper component for the extension elements that adds some basic styling to them
 */
export default function ExtensionRoot(props: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
    const [theme, setTheme] = React.useState<ThemeName>('light');

    return (
        <React.StrictMode>
            <SentryProvider>
                <QueryClientProvider client={queryClient}>
                    <ThemeContext.Provider value={{ theme, setTheme }}>
                        <ShadowRootContainer {...props} theme={theme} />
                    </ThemeContext.Provider>
                </QueryClientProvider>
            </SentryProvider>
        </React.StrictMode>
    );
}

export const ExtensionRootWrapper = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        // inherits the theme from the nearest ExtensionRoot, since this renders into its own
        // (nested) shadow root for portals like Dialog/Dropdown/QuickAddModal
        const { theme } = useTheme();
        return <ShadowRootContainer {...props} className={className} theme={theme} ref={ref} />;
    }
);

ExtensionRootWrapper.displayName = 'ExtensionRootWrapper';
