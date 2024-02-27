import { generateRandomId } from '@shared/util/random';
import { describe, expect, it } from 'vitest';

describe('generateRandomId', () => {
    it('should generate a random ID with the specified length', () => {
        // Test case 1: Length 5
        expect(generateRandomId(5)).toHaveLength(5);

        // Test case 2: Length 10
        expect(generateRandomId(10)).toHaveLength(10);

        // Test case 3: Length 15
        expect(generateRandomId(15)).toHaveLength(15);
    });

    it('should generate a unique ID each time', () => {
        // Generate 100 IDs and check if they are all unique
        const ids = new Set<string>();
        for (let i = 0; i < 100; i += 1) {
            const id = generateRandomId();
            expect(ids.has(id)).toBe(false);
            ids.add(id);
        }
    });
});
