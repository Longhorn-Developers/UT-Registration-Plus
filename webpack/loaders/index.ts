import { RuleSetRule } from 'webpack';
import * as styleLoaders from './styleLoaders';

/** using esbuild-loader for ⚡ fast builds */
const typescriptLoader: RuleSetRule = {
    test: /\.tsx?$/,
    loader: 'esbuild-loader',
    options: {
        loader: 'tsx',
        target: 'es2021',
    },
};

/** convert svgs to react components automatically */
const svgLoader: RuleSetRule = {
    test: /\.svg$/,
    issuer: /\.tsx?$/,
    loader: '@svgr/webpack',
};

/** these are files that we want to be able to be loaded into the extension folder instead of imported */
const urlLoader: RuleSetRule = {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.mp3$/],
    loader: 'url-loader',
    options: {
        limit: '10000',
        name: 'static/media/[name].[ext]',
    },
};

/** these loaders will allow us to use raw css imports, css modules, raw sass imports, and sass modules */
const { cssLoader, cssModuleLoader, sassLoader, sassModuleLoader } = styleLoaders;

// this is the default file loader, it will be used for any file that doesn't match the other loaders
const fileLoader: RuleSetRule = {
    loader: 'file-loader',
    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/, /\.mp3$/],
    options: {
        name: 'static/media/[name].[ext]',
    },
};

/** the assembled list of loaders in the order that we want webpack to attempt to use them on modules */
const loaders: RuleSetRule[] = [
    typescriptLoader,
    {
        // IMPORTANT: if you are adding a new loader, it must come before the file loader
        oneOf: [svgLoader, urlLoader, cssLoader, cssModuleLoader, sassLoader, sassModuleLoader, fileLoader],
    },
];

export default loaders;
