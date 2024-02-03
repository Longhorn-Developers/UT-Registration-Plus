import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

const root = resolve(__dirname, '../src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const publicDir = resolve(__dirname, '../public');

console.log(root);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), UnoCSS(), Icons({ compiler: 'jsx', jsx: 'react' })],
    resolve: {
        alias: {
            src: root,
            '@assets': assetsDir,
            '@pages': pagesDir,
            '@public': publicDir,
            '@shared': resolve(root, 'shared'),
            '@background': resolve(pagesDir, 'background'),
            '@views': resolve(root, 'views'),
        },
    },
});
