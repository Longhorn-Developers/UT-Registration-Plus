import classNames from 'classnames';
import React, { PropsWithChildren, useCallback } from 'react';
import styles from './Popup.module.scss';

interface Props {
    testId?: string;
    style?: React.CSSProperties;
    className?: string;
    /** Should it display a subtle dark overlay over the rest of the screen */
    overlay?: boolean;
    onClose?: () => void;
}

/**
 * A reusable popup component that can be used to display content on the page
 * @returns
 */
export default function Popup({ onClose, children, className, style, testId, overlay }: PropsWithChildren<Props>) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const bodyRef = React.useRef<HTMLDivElement>(null);


    
    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (!bodyRef.current) return;
            if (!bodyRef.current.contains(event.target as Node)) {
                onClose?.();
            }
        },
        [onClose, bodyRef]
    );

    React.useEffect(() => {
        const shadowRoot = document.getElementById('ut-registration-plus-container')?.shadowRoot;
        if (!shadowRoot) return;

        shadowRoot.addEventListener('mousedown', handleClickOutside);

        return () => {
            shadowRoot.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div
            style={style}
            ref={containerRef}
            className={classNames(styles.container, {
                [styles.overlay]: overlay,
            })}
            data-testid={testId}
        >
            <div ref={bodyRef} className={classNames(styles.body, className)}>
                {children}
            </div>
        </div>
    );
}
