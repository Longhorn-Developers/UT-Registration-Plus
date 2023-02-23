import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import path from 'path';
import { Server } from 'socket.io';
import config from './webpack.config';
import { version } from '../package.json';
import { getManifest } from './manifest.config';
import { initializeHotReloading } from './plugins/custom/hotReloadServer';

const HOT_RELOAD_PORT = 9090;
const MODE: Environment = 'development';

const manifest = getManifest(MODE, version);
const compiler = webpack(config(MODE, manifest));

initializeHotReloading(HOT_RELOAD_PORT, compiler);

const server = new WebpackDevServer(
    {
        https: false,
        hot: false,
        client: false,
        host: 'localhost',
        static: {
            directory: path.resolve('build'),
        },
        devMiddleware: {
            writeToDisk: true,
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        allowedHosts: 'all',
        watchFiles: {
            paths: ['src/**/*.{ts,tsx,js,jsx,html,css,scss,json,md,png,jpg,jpeg,gif,svg}', 'public/**/*'],
        },
    },
    compiler
);

await server.start();
