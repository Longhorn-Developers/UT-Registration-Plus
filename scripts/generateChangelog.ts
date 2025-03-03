import { exec } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

interface Props {
    preset:
        | 'angular'
        | 'atom'
        | 'codemirror'
        | 'conventionalcommits'
        | 'ember'
        | 'eslint'
        | 'express'
        | 'jquery'
        | 'jshint';

    // The file to write the changelog to
    outFile?: string;

    // How many releases to be generated from the latest
    // If 0, the whole changelog will be regenerated and the outfile will be overwritten
    releaseCount?: number;
}

/**
 * Generates a changelog using the conventional-changelog command.
 *
 * @returns A promise that resolves when the changelog is generated.
 * @throws If there is an error generating the changelog.
 */
async function generateChangelog({ preset, outFile = 'CHANGELOG.md', releaseCount = 1 }: Props): Promise<void> {
    try {
        // Run the conventional-changelog command to generate changelog
        const { stdout, stderr } = await execPromise(
            `conventional-changelog -p ${preset} -i ${outFile} -s -r ${releaseCount}`,
            {
                // Ensures it runs from the project root
                cwd: resolve(process.cwd()),
            }
        );

        // Log output and error if any
        console.log(stdout);
        if (stderr) {
            console.error(stderr);
        }
    } catch (error) {
        console.error('Error generating changelog:', error);
    }
}

generateChangelog({ preset: 'conventionalcommits', releaseCount: 0 });
