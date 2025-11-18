/**
 * Polyfills for older browsers that don't support modern JavaScript features
 */

// Polyfill for Array.prototype.toSorted (Chrome 110+, Firefox 115+, Safari 16+)
// Needed for Chrome 109 users
if (!Array.prototype.toSorted) {
    // eslint-disable-next-line no-extend-native
    Array.prototype.toSorted = function <T>(this: T[], compareFn?: (a: T, b: T) => number): T[] {
        // Create a shallow copy using slice(), then sort it
        return this.slice().sort(compareFn);
    };
}
