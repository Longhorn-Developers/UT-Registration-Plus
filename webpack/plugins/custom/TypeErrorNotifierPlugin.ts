import { Compiler } from 'webpack';
import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import WebpackBuildNotifierPlugin from 'webpack-build-notifier';
import { Issue, IssueLocation } from 'fork-ts-checker-webpack-plugin/lib/issue';

interface Resource {
    path: string;
    location: IssueLocation;
}

/**
 * This plugin hooks into the fork-ts-checker-webpack-plugin and
 * notifies the developer of type errors using the webpack-build-notifier plugin.
 */
export default class TypeErrorNotifierPlugin {
    apply(compiler: Compiler) {
        // hook into the fork-ts-checker-webpack-plugin
        const hooks = ForkTsCheckerWebpackPlugin.getCompilerHooks(compiler);
        hooks.issues.tap('MyPlugin', issues => {
            const errors = issues.filter(issue => issue.severity === 'error');
            if (!errors?.[0]?.message) {
                return errors;
            }

            let error = errors[0];
            let resource = getErrorResource(error);

            try {
                notifyTypeError(resource, error.message, errors);
            } catch (e) {
                console.error(e);
            }
            return errors;
        });
    }
}

function notifyTypeError(resource: Resource, message: string, errors: Issue[]) {
    const { line, column } = resource.location.start;

    const buildNotifier = new WebpackBuildNotifierPlugin({
        logo: path.resolve('public', 'icons', 'icon_production_128.png'),
        compilationSound: 'Pop',
        failureSound: 'Sosumi',
        title: `TS: ${errors.length} errors`,
        notifyOptions: {
            open: `vscode://file/${resource.path}:${line}:${column}`,
        },
    });

    const fakeInput = {
        hasErrors: () => true,
        compilation: {
            children: null,
            errors: [
                {
                    message,
                    module: {
                        resource: resource.path,
                    },
                },
            ],
        },
    };
    // @ts-ignore - private method
    buildNotifier.onCompilationDone(fakeInput);
}

function getErrorResource(error: Issue): Resource {
    return {
        path: error.file ?? '',
        location: error.location ?? {
            end: {
                column: 0,
                line: 0,
            },
            start: {
                column: 0,
                line: 0,
            },
        },
    };
}
