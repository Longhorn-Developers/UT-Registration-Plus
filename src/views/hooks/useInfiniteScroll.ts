import { useState, useEffect } from 'react';
import { sleep } from 'src/shared/util/time';

/**
 * Hook to execute a callback when the user scrolls to the bottom of the page
 * @param callback the function to be called when the user scrolls to the bottom of the page
 * @returns isLoading boolean to indicate if the callback is currently being executed
 */

export default function useInfiniteScroll(callback: () => Promise<boolean>): boolean {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', isScrolling);
        return () => window.removeEventListener('scroll', isScrolling);
    }, []);

    useEffect(() => {
        if (!isLoading) return;
        callback().then(isFinished => {
            if (!isFinished) {
                sleep(1000).then(() => {
                    setIsLoading(false);
                });
            }
        });
    }, [isLoading]);

    function isScrolling() {
        if (
            window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
            isLoading
        )
            return;
        setIsLoading(true);
    }
    return isLoading;
}
