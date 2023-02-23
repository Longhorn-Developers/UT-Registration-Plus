import { parse } from 'semver';

/**
 * Converts npm semver-style strings (including pre-releases) to a release version compatible
 * with the extension stores.
 *
 * @example
 * semverVersionTo('1.0.0-beta.1`) returns 1.0.0.100
 */
export function convertSemver(version: string): string {
    const semver = parse(version);
    if (!semver) {
        throw new Error(`Couldn't parse ${version}!`);
    }

    const { major, minor, patch, prerelease } = semver;
    let manifestVersion = `${major}.${minor}.${patch}`;
    if (prerelease.length) {
        manifestVersion += `.${prerelease[1]}00`;
    }
    return manifestVersion;
}
