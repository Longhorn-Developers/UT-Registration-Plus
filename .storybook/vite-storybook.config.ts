import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';

const root = resolve(__dirname, '../src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const publicDir = resolve(__dirname, '../public');

console.log(root);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@src': root,
            '@assets': assetsDir,
            '@pages': pagesDir,
            '@public': publicDir,
        },
    },
});
