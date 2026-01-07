import { useCallback, useEffect, useState } from 'react';

import { DEV_MODE_CLICK_INTERVAL, DEV_MODE_CLICK_TIMEOUT } from './constants';

/**
 * Custom hook for enabling developer mode via rapid clicking
 */
export const useDevMode = (targetCount: number): [boolean, () => void] => {
    const [count, setCount] = useState(0);
    const [active, setActive] = useState(false);
    const [lastClick, setLastClick] = useState(0);

    const incrementCount = useCallback(() => {
        const now = Date.now();
        if (now - lastClick < DEV_MODE_CLICK_INTERVAL) {
            setCount(prevCount => {
                const newCount = prevCount + 1;
                if (newCount === targetCount) {
                    setActive(true);
                }
                return newCount;
            });
        } else {
            setCount(1);
        }
        setLastClick(now);
    }, [lastClick, targetCount]);

    useEffect(() => {
        const timer = setTimeout(() => setCount(0), DEV_MODE_CLICK_TIMEOUT);
        return () => clearTimeout(timer);
    }, [count]);

    return [active, incrementCount];
};
