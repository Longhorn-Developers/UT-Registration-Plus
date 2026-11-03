import type { ThemeName } from '@shared/types/Theme';
import { useEffect, useState } from 'react';

/**
 * Reads the theme the host page is actually rendered in, based on its background color.
 * This also catches pages forced dark by other extensions (e.g. Dark Reader), which the
 * `prefers-color-scheme` media query does not reflect.
 */
function detectPageTheme(): ThemeName {
    for (const element of [document.body, document.documentElement]) {
        if (!element) continue;
        const [r = 0, g = 0, b = 0, alpha = 1] = (getComputedStyle(element).backgroundColor.match(/[\d.]+/g) ?? []).map(
            Number
        );
        if (alpha === 0) continue;
        // perceived brightness (ITU-R BT.601), 0-255
        return 0.299 * r + 0.587 * g + 0.114 * b < 128 ? 'dark' : 'light';
    }
    // a transparent page renders on the browser's default white canvas
    return 'light';
}

/**
 * @returns The host page's rendered theme, kept up to date as the page or another extension restyles it.
 */
export function usePageTheme(): ThemeName {
    const [theme, setTheme] = useState(detectPageTheme);

    useEffect(() => {
        let frame = 0;
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => setTheme(detectPageTheme()));
        };
        // dark mode extensions restyle the page by toggling attributes and injecting stylesheets
        const observer = new MutationObserver(update);
        observer.observe(document.documentElement, { attributes: true });
        observer.observe(document.head, { childList: true });
        if (document.body) observer.observe(document.body, { attributes: true });
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        media.addEventListener('change', update);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            media.removeEventListener('change', update);
        };
    }, []);

    return theme;
}
