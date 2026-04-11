// Must be first import — sets up globalThis.chrome before any other module evaluates
import './chrome-mock';

import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Preview } from '@storybook/react-vite';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import React from 'react';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        Story => (
            <React.StrictMode>
                <ExtensionRoot>
                    <Story />
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
