import { useEffect } from 'react';

/**
 * Hook to execute a callback when the user scrolls to the bottom of the page
 * @param callback the function to be called when the user scrolls to the bottom of the page
 * @returns isLoading boolean to indicate if the callback is currently being executed
 */

/**
 *
 */
export default function useInfiniteScroll(
    callback: () => Promise<void> | void,
    deps?: React.DependencyList | undefined
) {
    const isScrolling = () => {
        const { innerHeight } = window;
        const { scrollTop, offsetHeight } = document.documentElement;
        if (innerHeight + scrollTop >= offsetHeight - 650) {
            callback();
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', isScrolling, {
            passive: true,
        });
        return () => window.removeEventListener('scroll', isScrolling);
    }, deps);
}
