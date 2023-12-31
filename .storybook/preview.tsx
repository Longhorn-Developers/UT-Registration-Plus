import ExtensionRoot from '@src/views/components/common/ExtensionRoot/ExtensionRoot';
import type { Preview } from '@storybook/react';
import React from 'react';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        Story => (
            <ExtensionRoot>
                <Story />
            </ExtensionRoot>
        ),
    ],
};

export default preview;
