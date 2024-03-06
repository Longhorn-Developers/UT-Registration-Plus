import clsx from 'clsx';
import React from 'react';
import styles from './Button.module.scss';

interface Props {
    className?: string;
    style?: React.CSSProperties;
    variant?: 'filled' | 'outline' | 'single';
    onClick?: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    title?: string;
    testId?: string;
    useScss?: boolean;
}

const BUTTON_BASE_CLASS =
    'm-2.5 h-10 w-auto flex cursor-pointer content-center items-center gap-2 rounded-1 px-4 py-0 text-4.5 font-500 leading-normal font-sans btn-transition';

/**
 * A reusable button component that follows the design system of the extension.
 * @returns
 */
export function Button({
    className,
    style,
    variant,
    onClick,
    icon,
    disabled,
    title,
    testId,
    children,
    useScss = false,
}: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <button
            style={
                {
                    ...style,
                    '--color-primary': '#333F48',
                    '--color-secondary': '#FFFFFF',
                } as React.CSSProperties
            }
            data-testid={testId}
            className={clsx(styles.button, className, styles[type ?? 'primary'], {
                [styles.disabled]: disabled,
            })}
            title={title}
            disabled={disabled}
            onClick={disabled ? undefined : onClick}
        >
            {icon}
            {children}
        </button>
    );
}
