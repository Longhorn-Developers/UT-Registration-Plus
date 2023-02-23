import { Server } from 'socket.io';
import { Compiler } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

// Name of the plugin
const PLUGIN_NAME = 'HotReloadServer';

// How long to wait before reloading the browser after a successful build
const RELOAD_LOCKOUT = 2000;

// we want to cache all the "reload requests" here so we don't have to keep re-compiling the app while typing
const reloads: NodeJS.Timeout[] = [];

let io: Server;

export function initializeHotReloading(port: number, compiler: Compiler) {
    io = new Server(port);

    const hooks = ForkTsCheckerWebpackPlugin.getCompilerHooks(compiler);
    hooks.issues.tap(PLUGIN_NAME, (issues, compilation) => {
        const typeErrors = issues.filter(issue => issue.severity === 'error');
        const buildErrors = compilation?.errors ?? [];
        // if no errors (thus successful build), lets queue up a reload for the browser
        if (typeErrors.length === 0 && buildErrors.length === 0) {
            reloads.push(setTimeout(() => io.emit('reload'), RELOAD_LOCKOUT));
        }
        return typeErrors;
    });

    // if a recompile is triggered, we want to clear out all the queue'd reloads
    // (so we don't spam-reload the extension while we are still typing
    compiler.hooks.compile.tap(PLUGIN_NAME, () => {
        reloads.forEach(reload => clearTimeout(reload));
        reloads.length = 0;
    });
}
