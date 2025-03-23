import { capitalize, capitalizeFirstLetter, ellipsify, englishStringifyList } from '@shared/util/string';
import { describe, expect, it } from 'vitest';

// TODO: Fix `string.ts` and `string.test.ts` to make the tests pass
// `capitalize` is adding an extra space at the end of the word.
describe('capitalize', () => {
    it('should capitalize the first letter of each word', () => {
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

describe('englishStringifyList', () => {
    it('should handle an empty array', () => {
        const data = [] satisfies string[];
        const result = englishStringifyList(data);
        const expected = '';
        expect(result).toBe(expected);
    });

    it('should handle 1 element', () => {
        const data = ['Alice'] satisfies string[];
        const result = englishStringifyList(data);
        const expected = 'Alice';
        expect(result).toBe(expected);
    });

    it('should handle 2 elements', () => {
        const data = ['Alice', 'Bob'] satisfies string[];
        const result = englishStringifyList(data);
        const expected = 'Alice and Bob';
        expect(result).toBe(expected);
    });

    it('should handle 3 elements', () => {
        const data = ['Alice', 'Bob', 'Charlie'] satisfies string[];
        const result = englishStringifyList(data);
        const expected = 'Alice, Bob, and Charlie';
        expect(result).toBe(expected);
    });

    it('should handle n elements', () => {
        const testcases = [
            { data: [], expected: '' },
            { data: ['foo'], expected: 'foo' },
            { data: ['foo', 'bar'], expected: 'foo and bar' },
            { data: ['foo', 'bar', 'baz'], expected: 'foo, bar, and baz' },
            { data: ['a', 'b', 'c', 'd'], expected: 'a, b, c, and d' },
            { data: 'abcdefghijk'.split(''), expected: 'a, b, c, d, e, f, g, h, i, j, and k' },
        ] satisfies { data: string[]; expected: string }[];

        for (const { data, expected } of testcases) {
            const result = englishStringifyList(data);
            expect(result).toBe(expected);
        }
    });
});
