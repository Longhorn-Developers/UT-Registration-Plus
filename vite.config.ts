import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';
import manifest from './src/manifest';

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');

const isDev = process.env.NODE_ENV === 'development';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        crx({ manifest }),
        inspect(),
        {
            name: 'public-transform',
            apply: 'serve',
            transform(code, id) {
                if (id.endsWith('.tsx') || id.endsWith('.ts') || id.endsWith('.scss') || id.endsWith('?url')) {
                    return code.replace(
                        /(['"])(\/public\/.*?)(['"])/g,
                        (_, quote1, path, quote2) => `chrome.runtime.getURL(${quote1}${path}${quote2})`
                    );
                }
            },
        },
        {
            name: 'public-transform2',
            // enforce: 'post',
            transform(code, id) {
                if (id.replace(/\?used$/, '').endsWith('.scss')) {
                    console.log(code);
                    const transformedCode = code.replace(
                        /(__VITE_ASSET__.*?__)/g,
                        (_, path) => `chrome-extension://__MSG_@@extension_id__${path}`
                    );
                    if (transformedCode !== code) {
                        console.log(`Transformed CSS file: ${id}`);
                    }
                    return transformedCode;
                }
                return code;
            },
        },
    ],
    resolve: {
        alias: {
            '@src': root,
            '@assets': assetsDir,
            '@pages': pagesDir,
            '@public': publicDir,
        },
    },
    server: {
        hmr: {
            port: 5174,
        },
    },
    build: {
        rollupOptions: {
            external: ['/@react-refresh'],
        },
    },
});
