/**
 * Given a string, returns a string with the first letter capitalized.
 * @input The string to capitalize.
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
    return capitalized;
}

/**
 * Given a string, returns a string with the first letter capitalized.
 * @param input capitalize the first letter of this string
 * @returns the string with the first letter capitalized
 */
export function capitalizeFirstLetter(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

/**
 * Cuts the
 * @param input The string to ellipsify.
 * @param length The length of the string to return.
 * @returns The ellipsified string.
 */
export const ellipsify = (input: string, chars: number): string => {
    let ellipisifed = input;
    if (input && input.length > chars) {
        ellipisifed = `${input.substring(0, chars)}...`;
    }
    return ellipisifed;
};
