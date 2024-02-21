import { describe, expect, it } from 'vitest';

import { capitalize } from '../string';

// TODO: Fix `string.ts` and `string.test.ts` to make the tests pass
// `capitalize` is adding an extra space at the end of the word.
describe('capitalize', () => {
    it('should capitalize the first letter of each word', () => {
        // Debug
        const word = 'hello world';
        const capitalized = capitalize(word);
        console.log(capitalize(word));
        console.log(capitalized.length);
        console.log(capitalized.split(''));

        // Test case 1: Single word
        expect(capitalize('hello')).toBe('Hello');

        // Test case 2: Multiple words
        expect(capitalize('hello world')).toBe('Hello World');

        // Test case 3: Words with hyphens
        expect(capitalize('hello-world')).toBe('Hello-World');

        // Test case 4: Words with hyphens and spaces
        expect(capitalize('hello-world test')).toBe('Hello-World Test');
    });

    it('should not change the capitalization of the remaining letters', () => {
        // Test case 1: All lowercase
        expect(capitalize('hello')).toBe('Hello');

        // Test case 2: All uppercase
        expect(capitalize('WORLD')).toBe('WORLD');

        // Test case 3: Mixed case
        expect(capitalize('HeLLo WoRLd')).toBe('Hello World');
    });
});
