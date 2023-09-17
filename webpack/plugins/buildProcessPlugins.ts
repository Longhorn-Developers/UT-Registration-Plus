import path from 'path';
import dotenv from 'dotenv';
import webpack, { WebpackPluginInstance } from 'webpack';
import { EntryId } from 'webpack/webpack.config';
import CreateFileWebpack from 'create-file-webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import WebpackBuildNotifierPlugin from 'webpack-build-notifier';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TypeErrorNotifierPlugin from './custom/TypeErrorNotifierPlugin';

/**
 *  Gets the plugins that are used in the build process
 * @param mode the environment that the build is running in
 * @param htmlEntries the entry points that need an html file
 * @param manifest the manifest.json file
 * @returns an array of webpack plugins
 */
export function getBuildPlugins(mode: Environment, htmlEntries: EntryId[], manifest: chrome.runtime.ManifestV3) {
    let plugins: WebpackPluginInstance[] = [];

    // show the progress of the build
    plugins.push(new webpack.ProgressPlugin());

    // make sure that the paths are case sensitive
    plugins.push(new CaseSensitivePathsPlugin());

    plugins.push(new CleanWebpackPlugin());

    // specify how the outputed css files should be named
    plugins.push(
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].css',
            chunkFilename: 'static/css/[name].chunk.css',
        })
    );

    // create an html file for each entry point that needs one
    for (const entryId of htmlEntries) {
        // if (!entries[entryId]) return;
        plugins.push(
            new HTMLWebpackPlugin({
                hash: false,
                filename: `${entryId}.html`,
                chunks: [entryId],
                title: `${entryId} `,
                template: path.resolve('webpack', 'plugins', 'template.html'),
            })
        );
    }

    // write the manifest.json file to the build directory
    plugins.push(
        new CreateFileWebpack({
            path: path.resolve('build'),
            fileName: 'manifest.json',
            content: JSON.stringify(manifest, null, 2),
        })
    );

    // copy the public directory to the build directory, but only copy the icons for the current mode
    plugins.push(
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve('public'),
                    filter: path => (path.includes('icons/icon') ? path.includes(mode) : true),
                },
            ],
        })
    );

    // run the typescript checker in a separate process
    plugins.push(
        new ForkTsCheckerWebpackPlugin({
            async: false,
        })
    );

    // notify the developer of build events when in development mode
    if (mode === 'development') {
        plugins.push(
            new WebpackBuildNotifierPlugin({
                title: `${manifest.short_name} v${manifest.version} ${mode}`,
                logo: path.resolve('public', 'icons', 'icon_production_128.png'),
                failureSound: 'Ping',
                successSound: false,
                showDuration: true,
                suppressWarning: true,
            })
        );
    }

    // notify the developer of type errors
    plugins.push(new TypeErrorNotifierPlugin());

    // define the environment variables that are available within the extension code
    plugins.push(
        new webpack.DefinePlugin({
            'process.env': JSON.stringify({
                SEMANTIC_VERSION: process.env.SEMANTIC_VERSION,
                NODE_ENV: mode,
                ...dotenv.config({ path: `.env.${mode}` }).parsed,
            } satisfies typeof process.env),
        })
    );

    // provide some global nodejs variables so that nodejs libraries can be used
    plugins.push(
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        })
    );

    return plugins;
}
