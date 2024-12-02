import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Custom hook to get the initial width of an HTML element.
 * @returns An object containing the width of the element and a ref to the element.
 */
function useInitialWidth<T extends HTMLElement>() {
    const [width, setWidth] = useState<number>(0);
    const elementRef = useRef<T>(null);

    useLayoutEffect(() => {
        if (elementRef.current) {
            setWidth(elementRef.current.offsetWidth);
        }
    }, []);

    return { width, elementRef };
}

export default useInitialWidth;
