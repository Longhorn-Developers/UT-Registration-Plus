import { useEffect } from 'react';

/**
 * Hook that calls a callback when a key is pressed
 *
 * @param key - the key to listen for
 * @param callback - the callback to call when the key is pressed
 */
export function useKeyPress(key: string, callback: (event: KeyboardEvent) => void): void {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === key) {
                callback(event);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [key, callback]);
}
