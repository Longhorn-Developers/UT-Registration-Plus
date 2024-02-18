import { useEffect } from 'react';

/**
 * Hook to execute a callback when the user scrolls to the bottom of the page
 * @param callback the function to be called when the user scrolls to the bottom of the page
 * @returns isLoading boolean to indicate if the callback is currently being executed
 */

/**
 * Custom hook for implementing infinite scrolling behavior.
 *
 * @param callback - The function to be called when scrolling reaches the bottom.
 * @param deps - Optional dependencies array to control when the hook should re-run.
 */
export default function useInfiniteScroll(
    callback: () => Promise<void> | void,
    deps?: React.DependencyList | undefined
) {
    useEffect(() => {
        const isScrolling = () => {
            const { innerHeight } = window;
            const { scrollTop, offsetHeight } = document.documentElement;
            if (innerHeight + scrollTop >= offsetHeight - 650) {
                callback();
            }
        };

        window.addEventListener('scroll', isScrolling, {
            passive: true,
        });
        return () => window.removeEventListener('scroll', isScrolling);
    }, [deps, callback]);
}
