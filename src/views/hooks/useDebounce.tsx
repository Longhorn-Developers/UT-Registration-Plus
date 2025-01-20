import { useCallback, useEffect, useRef } from 'react';

type Timer = ReturnType<typeof setTimeout>;
type DebouncedCallback<T extends unknown[]> = (...args: T) => void;

/**
 * Custom hook to debounce a function call.
 *
 * @param func - The original, non-debounced function.
 * @param delay - The delay (in ms) for the function to return.
 * @returns The debounced function, which will run only if the debounced function has not been called in the last (delay) ms.
 */
export function useDebounce<T extends unknown[]>(
    func: DebouncedCallback<T>,
    delay: number = 1000
): DebouncedCallback<T> {
    const timer = useRef<Timer>();

    useEffect(
        () => () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        },
        []
    );

    const debouncedFunction = useCallback(
        (...args: T) => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
                func(...args);
            }, delay);
        },
        [func, delay]
    );

    return debouncedFunction;
}
