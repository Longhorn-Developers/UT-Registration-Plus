/**
 * Polyfills for older browsers that don't support modern JavaScript features
 */

// Polyfill for Array.prototype.toSorted
// https://github.com/Longhorn-Developers/UT-Registration-Plus/issues/633
if (!Array.prototype.toSorted) {
    // eslint-disable-next-line no-extend-native
    Array.prototype.toSorted = function <T>(this: T[], compareFn?: (a: T, b: T) => number): T[] {
        return this.slice().sort(compareFn);
    };
}
