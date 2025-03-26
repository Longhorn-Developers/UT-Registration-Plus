import { sleep } from '@shared/util/time';
import { describe, expect, it } from 'vitest';

describe('sleep', () => {
    it('should resolve after the specified number of milliseconds', async () => {
        const start = performance.now();
        const milliseconds = 1000;
        await sleep(milliseconds);
        const end = performance.now();
        const elapsed = end - start;
        // Flaky test due to JS's lack of precision in setTimeout,
        // so we allow for a 1ms difference
        expect(elapsed).toBeGreaterThanOrEqual(milliseconds - 1);
    });
});
