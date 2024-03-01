import { capitalize, capitalizeFirstLetter, ellipsify } from '@shared/util/string';
import { describe, expect, it } from 'vitest';

// TODO: Fix `string.ts` and `string.test.ts` to make the tests pass
// `capitalize` is adding an extra space at the end of the word.
describe('capitalize', () => {
    it('should capitalize the first letter of each word', () => {
        // Debug
        // const word = 'hello world';
        // const capitalized = capitalize(word);
        // console.log(capitalize(word));
        // console.log(capitalized.length);
        // console.log(capitalized.split(''));

        // Test case 1: Single word
        expect(capitalize('hello')).toBe('Hello');

        // Test case 2: Multiple words
        expect(capitalize('hello world')).toBe('Hello World');

        // Test case 3: Words with hyphens
        expect(capitalize('hello-world')).toBe('Hello-World');

        // Test case 4: Words with hyphens and spaces
        expect(capitalize('hello-world test')).toBe('Hello-World Test');
    });
});

describe('capitalizeFirstLetter', () => {
    it('should return a string with the first letter capitalized', () => {
        // Test case 1: Single word
        expect(capitalizeFirstLetter('hello')).toBe('Hello');

        // Test case 2: Word with all lowercase letters
        expect(capitalizeFirstLetter('world')).toBe('World');

        // Test case 3: Word with all uppercase letters
        expect(capitalizeFirstLetter('EXAMPLE')).toBe('Example');

        // Test case 4: Word with mixed case letters
        expect(capitalizeFirstLetter('tEsT')).toBe('Test');
    });

    it('should handle empty string input', () => {
        expect(capitalizeFirstLetter('')).toBe('');
    });
});

describe('ellipsify', () => {
    it('should add ellipsis if the input string exceeds the specified character limit', () => {
        // Test case 1: Input string is shorter than the character limit
        expect(ellipsify('Hello', 10)).toBe('Hello');

        // Test case 2: Input string is equal to the character limit
        expect(ellipsify('Hello World', 11)).toBe('Hello World');

        // Test case 3: Input string is longer than the character limit
        expect(ellipsify('Hello World', 5)).toBe('Hello...');

        // Test case 4: Input string is empty
        expect(ellipsify('', 5)).toBe('');
    });
});
