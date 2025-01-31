import { useEffect } from 'react';

/**
 * Dynamically applies a grabbing cursor to the root element with the important flag
 */
export const useCursor = () => {
    useEffect(() => {
        const html = document.documentElement;
        return () => {
            html.style.removeProperty('cursor');
            html.classList.remove('[&_*]:!cursor-grabbing', '!cursor-grabbing');
        };
    }, []);

    const setCursor = (cursor: string) => {
        const html = document.documentElement;
        if (cursor === 'grabbing') {
            html.classList.add('[&_*]:!cursor-grabbing', '!cursor-grabbing');
        } else {
            html.classList.remove('[&_*]:!cursor-grabbing', '!cursor-grabbing');
        }
    };

    return { setCursor };
};
