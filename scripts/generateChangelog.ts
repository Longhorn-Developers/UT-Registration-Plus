import { exec } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Generates a changelog using the conventional-changelog command.
 *
 * @returns {Promise<void>} A promise that resolves when the changelog is generated.
 * @throws {Error} If there is an error generating the changelog.
 */
async function generateChangelog(): Promise<void> {
    try {
        // Run the conventional-changelog command to generate changelog
        // This will overwrite any previous changelogs if they exist
        const { stdout, stderr } = await execPromise('conventional-changelog -p angular -i CHANGELOG.md -s -r 0', {
            // Ensures it runs from the project root
            cwd: resolve(process.cwd()),
        });

        // Log output and error if any
        console.log(stdout);
        if (stderr) {
            console.error(stderr);
        }
    } catch (error) {
        console.error('Error generating changelog:', error);
    }
}

generateChangelog();
