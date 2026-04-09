import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import Icons from 'unplugin-icons/vite';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import { inlineStyles } from '../utils/plugins/vite-inline-styles';
import reactFallbackThrottlePlugin from 'vite-plugin-react-fallback-throttle';

const root = resolve(__dirname, '../src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const publicDir = resolve(__dirname, '../public');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        UnoCSS(),
        reactFallbackThrottlePlugin(0),
        Icons({ compiler: 'jsx', jsx: 'react' }),
        inlineStyles(),
    ],
    resolve: {
        alias: {
            src: root,
            '@assets': assetsDir,
            '@pages': pagesDir,
            '@public': publicDir,
            '@shared': resolve(root, 'shared'),
            '@background': resolve(pagesDir, 'background'),
            '@views': resolve(root, 'views'),
            '@chrome-extension-toolkit': resolve(root, 'lib/chrome-extension-toolkit'),
            '@sentry/react': resolve(__dirname, '__mocks__/sentry.ts'),
        },
    },
});
