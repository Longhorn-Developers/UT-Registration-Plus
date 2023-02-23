import webpack from 'webpack';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import config from './webpack.config';
import { info, success } from './utils/chalk';
import { getManifest } from './manifest.config';
import { version } from '../package.json';
import { convertSemver } from './utils/convertSemver';
import printError from './utils/printError';
import { zipProductionBuild } from './utils/zipProductionBuild';

const MODE: Environment = 'production';

// generate the manifest.json file
const semanticVersion = process.env.SEMANTIC_VERSION || version;
const manifestVersion = convertSemver(semanticVersion);
const manifest = getManifest(MODE, manifestVersion);

console.log(info(`${manifest.short_name} v${manifest.version} ${MODE} build starting...`));

// kick off the webpack build
webpack(config(MODE, manifest), async error => {
    if (!error) {
        await onBuildSuccess();
        process.exit(0);
    }
    await onBuildFailure(error);
    process.exit(1);
});

async function onBuildSuccess(): Promise<void> {
    // zip the output directory and put it in the artifacts directory
    const fileName = `${manifest.short_name} v${manifestVersion}`;
    await zipProductionBuild(fileName);
    console.log(success(`${fileName} built and zipped into build/artifacts/${fileName}.zip!`));
}

function onBuildFailure(error: Error): void {
    if (!error.message) {
        return printError(error);
    }
    const messages = formatWebpackMessages({ errors: [error.message], warnings: [] });
    if (messages.errors.length > 1) {
        messages.errors.length = 1;
    }
    return printError(new Error(messages.errors.join('\n\n')));
}
