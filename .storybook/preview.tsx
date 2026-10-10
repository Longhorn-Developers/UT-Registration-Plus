// Must be first imports — set up globalThis.chrome/fetch before any other module evaluates
import './chrome-mock';
import './fetch-mock';

import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Preview } from '@storybook/react-vite';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import React from 'react';
import { themeLabels, themes, type ThemeName } from '@shared/types/Theme';
import { useThemeSync } from '@views/hooks/useThemeSync';

function ThemeBridge({ theme, children }: { theme: ThemeName; children: React.ReactNode }) {
    useThemeSync(theme);

    React.useEffect(() => {
        document.body.style.backgroundColor = theme === 'dark' ? '#09090b' : '#ffffff';
    }, [theme]);

    return <>{children}</>;
}

const preview: Preview = {
    initialGlobals: { theme: 'light' },
    globalTypes: {
        theme: {
            description: 'Extension theme',
            toolbar: {
                title: 'Theme',
                icon: 'circlehollow',
                items: themes.map(t => ({ value: t, title: themeLabels[t] })),
                dynamicTitle: true,
            },
        },
    },
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story, context) => (
            <React.StrictMode>
                <ExtensionRoot>
                    <ThemeBridge theme={context.globals.theme as ThemeName}>
                        <Story />
                    </ThemeBridge>
                </ExtensionRoot>
            </React.StrictMode>
        ),
    ],
};

// set updatedAt dates to be fixed
UserScheduleStore.get('schedules').then(schedules => {
    schedules.forEach(schedule => {
        schedule.updatedAt = new Date('2024-01-01 12:00').getTime();
    });
    UserScheduleStore.set('schedules', schedules);
});

export default preview;
