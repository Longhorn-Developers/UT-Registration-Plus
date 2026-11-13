import { resolve } from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import storybookViteConfig from './.storybook/vite-storybook.config';

/**
 * Behavior tests: runs Storybook stories tagged `behavior` (and their `play` functions) as Vitest
 * tests in a real Chromium browser. Run with `pnpm test:storybook`.
 *
 * Kept separate from `vite.config.ts` so the existing jsdom unit tests (`pnpm test`) don't need a
 * browser, and so the stories build with Storybook's own Vite config rather than the extension's.
 *
 * Each story runs once per theme (one Vitest project per theme), so a tested flow is checked in
 * both light and dark mode without writing the test twice.
 */
const themeProject = (theme: 'light' | 'dark') =>
    mergeConfig(
        storybookViteConfig,
        defineConfig({
            plugins: [
                storybookTest({
                    configDir: resolve(__dirname, '.storybook'),
                    tags: { include: ['behavior'] },
                    initialGlobals: { theme },
                }),
            ],
            test: {
                name: `storybook-${theme}`,
                browser: {
                    enabled: true,
                    headless: true,
                    provider: playwright(),
                    instances: [{ browser: 'chromium' }],
                },
            },
        })
    );

export default defineConfig({
    test: {
        projects: [themeProject('light'), themeProject('dark')],
    },
});
