/**
 * Generate a random ID
 *
 * @returns string of size 10 made up of random numbers and letters
 * @param length the length of the ID to generate
 * @example "cdtl9l88pj"
 */
export function generateRandomId(length: number = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i += 1) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate a random number between min and max
 * @param min the minimum number
 * @param max the maximum number
 * @returns a random number between min and max
 */
export function rangeRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
