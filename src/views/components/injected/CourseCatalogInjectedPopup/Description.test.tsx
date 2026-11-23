import type { Course } from '@shared/types/Course';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';

import Description from './Description';

vi.mock('@shared/storage/OptionsStore', () => ({
    OptionsStore: {
        useStore: (select: (state: { enableReducedMotion: boolean }) => unknown) =>
            select({ enableReducedMotion: true }),
    },
}));

afterEach(() => vi.unstubAllGlobals());

it('keeps description placeholders themed while a slow request is pending', async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.stubGlobal(
        'fetch',
        vi.fn(() => new Promise<Response>(() => {}))
    );
    const container = document.createElement('div');
    const root = createRoot(container);

    try {
        await act(async () => {
            root.render(<Description course={{ url: 'https://example.com/course' } as Course} />);
        });

        expect(fetch).toHaveBeenCalledOnce();
        const placeholders = container.querySelectorAll<HTMLElement>('.react-loading-skeleton');
        expect(placeholders).toHaveLength(5);
        for (const placeholder of placeholders) {
            expect(placeholder.style.getPropertyValue('--base-color')).toBe('var(--color-surface)');
            expect(placeholder.style.getPropertyValue('--highlight-color')).toBe('var(--color-surface-hover)');
            expect(placeholder.style.getPropertyValue('--pseudo-element-display')).toBe('none');
        }
    } finally {
        await act(async () => root.unmount());
    }
});
