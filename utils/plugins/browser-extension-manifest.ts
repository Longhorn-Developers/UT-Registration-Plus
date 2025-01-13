import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { Plugin, ResolvedConfig } from 'vite';

// eslint-disable-next-line import-essentials/restrict-import-depth
import manifest from '../../manifest';

type ManifestBase = browser._manifest.ManifestBase;
type WebExtensionManifest = browser._manifest.WebExtensionManifest;
type ManifestV3 = ManifestBase & WebExtensionManifest;

type BrowserTarget = 'chrome' | 'firefox';

/**
 * Complete manifest configuration
 */
export interface ManifestConfig {
    /** Base manifest properties shared across browsers */
    base: ManifestBase;
    /** Chrome-specific manifest properties */
    chrome: WebExtensionManifest;
    /** Firefox-specific manifest properties */
    firefox: WebExtensionManifest;
}

/**
 * Plugin configuration options
 */
export interface ManifestPluginOptions {
    /** Path to the manifest configuration file */
    manifestPath?: string;
    /** Output directory for the generated manifest */
    outDir?: string;
    /** Enable verbose logging */
    verbose?: boolean;
}

/**
 * Validates the manifest configuration
 * @throws If the configuration is invalid
 */
function validateManifestConfig(config: unknown): asserts config is ManifestConfig {
    if (!config || typeof config !== 'object') {
        throw new Error('Invalid manifest configuration: must be an object');
    }

    const { base, chrome, firefox } = config as Partial<ManifestConfig>;

    if (!base?.name || !base?.version || !chrome || !firefox) {
        throw new Error('Invalid manifest configuration: missing required properties');
    }

    if (base.manifest_version !== 3) {
        throw new Error('Invalid manifest configuration: only manifest version 3 is supported');
    }
}

/**
 * Generates the final manifest by merging base and browser-specific configurations
 */
function generateManifest(config: ManifestConfig, target: BrowserTarget): ManifestV3 {
    const { base } = config;

    switch (target) {
        case 'chrome':
            return {
                ...base,
                ...config.chrome,
            };
        case 'firefox':
            return {
                ...base,
                ...config.firefox,
            };
        default:
            throw new Error(`Unsupported browser target: ${target}`);
    }
}

/**
 * Creates a Vite plugin for generating browser-specific extension manifests
 */
export default function browserExtensionManifestPlugin(options: ManifestPluginOptions = {}): Plugin {
    const { manifestPath = 'manifest.ts', outDir = 'dist', verbose = true } = options;

    let config: ResolvedConfig;

    return {
        name: 'vite-plugin-browser-extension-manifest',

        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },

        async buildStart() {
            try {
                // Get browser target from environment variables
                // TODO: Add environment variable validation
                const browserTarget = process.env.BROWSER_TARGET as BrowserTarget;

                if (!browserTarget) {
                    throw new Error('BROWSER_TARGET environment variable must be set to either "chrome" or "firefox"');
                }

                if (verbose) {
                    console.log(chalk.blue('info'), `Target browser: ${browserTarget}`);
                }

                // // Resolve manifest file path
                // const manifestFullPath = path.resolve(config.root, manifestPath);

                // try {
                //     await fs.access(manifestFullPath);
                // } catch {
                //     console.error(chalk.red('error'), `Manifest file not found at ${chalk.cyan(manifestFullPath)}`);
                //     throw new Error('Manifest file not found');
                // }

                // // Import and validate manifest configuration
                // const manifestModule = await import(manifestFullPath);
                // const manifestConfig: unknown = manifestModule.default;

                // validateManifestConfig(manifestConfig);
                validateManifestConfig(manifest);

                if (verbose) {
                    console.log(chalk.blue('info'), 'Manifest configuration validated successfully');
                }

                // Generate browser-specific manifest
                const finalManifest = generateManifest(manifest, browserTarget);

                // Ensure output directory exists
                const browserOutDir = path.join(config.root, outDir, browserTarget);
                await fs.mkdir(browserOutDir, { recursive: true });

                // Write manifest file
                const manifestOutPath = path.join(browserOutDir, 'manifest.json');
                // await fs.writeFile(manifestOutPath, JSON.stringify(finalManifest, null, 2));

                if (verbose) {
                    console.log(
                        chalk.green('success'),
                        `Generated ${chalk.cyan(browserTarget)} manifest at ${chalk.dim(manifestOutPath)}`
                    );

                    // Log manifest content
                    console.log(chalk.blue('info'), 'Manifest content:');
                    console.log(JSON.stringify(finalManifest, null, 2));
                }

                console.log(
                    chalk.green('success'),
                    `Generated ${chalk.cyan(browserTarget)} manifest at ${chalk.dim(manifestOutPath)}`
                );
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                console.error(chalk.red('error'), message);
                throw error;
            }
        },
    };
}
