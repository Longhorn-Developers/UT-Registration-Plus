import chalk from 'chalk';
import type { Plugin } from 'vite';

/**
 * Options to configure the build logger.
 */
interface BuildLoggerOptions {
    includeEnvVars?: string[]; // Specific env vars to display
    includeTimestamp?: boolean;
    includeBuildTime?: boolean;
    customMetadata?: Record<string, () => string | Promise<string>>;
}

/**
 * Vite plugin to log build information.
 *
 * @param Options - to configure the build logger.
 *
 * @returns Vite plugin object.
 */
export function buildLogger(options: BuildLoggerOptions = {}): Plugin {
    const startTime = Date.now();

    return {
        name: 'vite-build-logger',
        enforce: 'post',

        async closeBundle() {
            console.log(`\n${chalk.bold.cyan('=== Build Information ===')}`);

            // Environment
            console.log(chalk.yellow('\nBuild Environment:'));
            console.log(`🔧 Node Build Mode: ${process.env.NODE_ENV}`);
            console.log(`🎯 Browser Target: ${process.env.BROWSER_TARGET}`);

            // Timestamp
            if (options.includeTimestamp) {
                console.log(chalk.yellow('\nBuild Timestamp:'));
                console.log(`📅 ${new Date().toISOString()}`);
            }

            // Build Time
            if (options.includeBuildTime) {
                const buildTime = Date.now() - startTime;
                console.log(chalk.yellow('\nBuild Time:'));
                console.log(`⏱️  ${buildTime}ms (${(buildTime / 1000).toFixed(2)}s)`);
            }

            // Selected Environment Variables
            if (options.includeEnvVars?.length) {
                console.log(chalk.yellow('\nEnvironment Variables:'));
                for (const envVar of options.includeEnvVars) {
                    if (process.env[envVar]) {
                        // Mask sensitive variables that might contain tokens or keys
                        const isSensitive =
                            envVar.toLowerCase().includes('key') ||
                            envVar.toLowerCase().includes('token') ||
                            envVar.toLowerCase().includes('secret');

                        const value = isSensitive ? '****' : process.env[envVar];
                        console.log(`${envVar}: ${value}`);
                    } else {
                        console.log(`${envVar}: ${chalk.red('Not defined')}`);
                    }
                }
            }

            // Custom Metadata
            if (options.customMetadata) {
                console.log(chalk.yellow('\nCustom Metadata:'));
                for (const [key, getter] of Object.entries(options.customMetadata)) {
                    // eslint-disable-next-line no-await-in-loop
                    const value = await getter();
                    console.log(`${key}: ${value}`);
                }
            }

            console.log(`\n${chalk.bold.cyan('=====================')}\n`);
        },
    };
}
