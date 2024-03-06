import clsx from 'clsx';
import React from 'react';
import styles from './Button.module.scss';

interface Props {
    className?: string;
    style?: React.CSSProperties;
    type?: 'filled' | 'outline' | 'single';
    onClick?: () => void;
    iconOnly?: boolean;
    showSymbol?: boolean;
    symbol?: React.ReactNode;
    disabled?: boolean;
    title?: string;
    testId?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

/**
 * A reusable button component that follows the design system of the extension.
 * @returns
 */
export function Button({
    className,
    style,
    type,
    onClick,
    iconOnly,
    showSymbol,
    symbol,
    disabled,
    title,
    testId,
    primaryColor,
    secondaryColor,
    children,
}: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <button
            style={
                {
                    ...style,
                    '--color-primary': primaryColor ?? '#333F48',
                    '--color-secondary': secondaryColor ?? '#FFFFFF',
                } as React.CSSProperties
            }
            data-testid={testId}
            className={clsx(styles.button, className, styles[type ?? 'primary'], {
                [styles.disabled]: disabled,
            })}
            title={title}
            onClick={disabled ? undefined : onClick}
        >
            {!iconOnly && children}
        </button>
    );
}
