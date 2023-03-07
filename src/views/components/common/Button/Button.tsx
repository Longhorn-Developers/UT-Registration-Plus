import classNames from 'classnames';
import React from 'react';
import styles from './Button.module.scss';

interface Props {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    type?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warning' | 'success' | 'info';
    disabled?: boolean;
    testId?: string;
}

/**
 * A reusable button component that follows the design system of the extension.
 * @returns
 */
export function Button({
    style,
    className,
    type,
    testId,
    children,
    disabled,
    onClick,
}: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <button
            style={style}
            data-testId={testId}
            className={classNames(styles.button, className, styles[type ?? 'primary'], {
                [styles.disabled]: disabled,
            })}
            onClick={disabled ? undefined : onClick}
        >
            {children}
        </button>
    );
}
