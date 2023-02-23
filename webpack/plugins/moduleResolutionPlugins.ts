import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import path from 'path';
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';

export const moduleResolutionPlugins = [
    // this will make sure that webpack uses the tsconfig path aliases
    new TsconfigPathsPlugin({
        configFile: path.resolve('src', 'tsconfig.json'),
    }),
    // this will make sure that we don't import anything outside of the src directory from the src directory
    new ModuleScopePlugin(path.resolve('src'), path.resolve('package.json')),
];
