/**
 * Given a string, returns a string with the first letter capitalized.
 *
 * @param input - The string to capitalize.
 */
export function capitalize(input: string): string {
    let capitalized = '';

    const words = input.split(' ');
    for (const word of words) {
        if (word.includes('-')) {
            const hyphenatedWords = word.split('-');
            for (const hyphenatedWord of hyphenatedWords) {
                capitalized += `${capitalizeFirstLetter(hyphenatedWord)}-`;
            }
            capitalized = capitalized.substring(0, capitalized.length - 1);
        } else {
            capitalized += capitalizeFirstLetter(word);
        }
        capitalized += ' ';
    }
    capitalized = capitalized.trim(); // Remove extra space

    return capitalized;
}

/**
 * Given a string, returns a string with the first letter capitalized.
 *
 * @param input - Capitalize the first letter of this string
 * @returns The string with the first letter capitalized
 */
export function capitalizeFirstLetter(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

/**
 * Cuts the input string to the specified length and adds an ellipsis if the string is longer than the specified length.
 *
 * @param input - The string to ellipsify.
 * @param length - The length of the string to return.
 * @returns The ellipsified string.
 */
export const ellipsify = (input: string, chars: number): string => {
    let ellipisifed = input;
    if (input && input.length > chars) {
        ellipisifed = `${input.substring(0, chars)}...`;
    }
    return ellipisifed;
};

/**
 *  Stringifies a list of items in English format.
 *
 * @param items - The list of items to stringify.
 * @returns A string representation of the list in English format.
 * @example
 * englishStringifyList([]) // ''
 * englishStringifyList(['Alice']) // 'Alice'
 * englishStringifyList(['Alice', 'Bob']) // 'Alice and Bob'
 * englishStringifyList(['Alice', 'Bob', 'Charlie']) // 'Alice, Bob, and Charlie'
 */
export const englishStringifyList = (items: readonly string[]): string => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0]!;
    if (items.length === 2) return `${items[0]} and ${items[1]}`;

    return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
};
