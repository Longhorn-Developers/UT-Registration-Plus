import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-onboarding',
        '@storybook/addon-interactions',
        {
            name: '@storybook/addon-styling',
            options: {
                sass: {
                    // Require your Sass preprocessor here
                    implementation: require('sass'),
                },
            },
        },
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    /**
        * Configures auto-generated documentation pages. 
        * Available options: true, false,tag (default). 
        * true/false enable/disable autodocs globally. 
        * tag allows you to opt in per component by adding the tags: ['autodocs'] annotation in the component's default export. 
        * Default: docs: { autodocs: 'tag' }
     */
    docs: {
        // autodocs: 'tag',
        autodocs: true,
    },
};
export default config;
