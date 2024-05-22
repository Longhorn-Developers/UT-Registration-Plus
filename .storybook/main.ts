import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-designs',
        '@storybook/test',
        '@chromatic-com/storybook',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {
            builder: {
                viteConfigPath: '.storybook/vite-storybook.config.ts',
            },
        },
    },
    docs: {
        autodocs: 'tag',
    },
};
export default config;
