import { useEffect } from 'react';

/**
 * Dynamically applies a grabbing cursor to the root element with the important flag
 */
export const useCursor = () => {
    useEffect(() => {
        const html = document.documentElement;
        return () => {
            html.style.removeProperty('cursor');
            html.classList.remove('[&_*]:!cursor-grabbing');
        };
    }, []);

    const setCursorGrabbing = (isGrabbing: boolean) => {
        const html = document.documentElement;

        if (isGrabbing) {
            html.classList.add('[&_*]:!cursor-grabbing');
        } else {
            html.classList.remove('[&_*]:!cursor-grabbing');
        }
    };

    return { setCursorGrabbing };
};
