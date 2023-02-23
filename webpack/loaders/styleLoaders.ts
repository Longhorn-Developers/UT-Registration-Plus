import { RuleSetRule, RuleSetUseItem } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

function buildStyleLoaders(cssLoaderOptions: Record<string, any>): RuleSetUseItem[] {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        {
            loader: 'css-loader',
            options: { ...cssLoaderOptions, sourceMap: false },
        },
    ];
    return loaders;
}

export const cssLoader: RuleSetRule = {
    test: cssRegex,
    exclude: cssModuleRegex,
    sideEffects: true,
    use: [
        ...buildStyleLoaders({
            importLoaders: 1,
            esModule: false,
        }),
    ],
};

export const cssModuleLoader: RuleSetRule = {
    test: cssModuleRegex,
    use: [
        ...buildStyleLoaders({
            importLoaders: 1,
            modules: {
                getLocalIdent: getCSSModuleLocalIdent,
            },
        }),
    ],
};

export const sassLoader: RuleSetRule = {
    test: sassRegex,
    exclude: sassModuleRegex,
    sideEffects: true,
    use: [
        ...buildStyleLoaders({
            importLoaders: 2,
        }),
        {
            loader: 'sass-loader',
        },
    ],
};

export const sassModuleLoader: RuleSetRule = {
    test: sassModuleRegex,
    use: [
        ...buildStyleLoaders({
            importLoaders: 2,
            modules: {
                getLocalIdent: getCSSModuleLocalIdent,
            },
        }),
        {
            loader: 'sass-loader',
        },
    ],
};
