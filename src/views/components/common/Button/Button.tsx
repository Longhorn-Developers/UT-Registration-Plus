import classNames from 'classnames';
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
            className={classNames(useScss ? styles.button : BUTTON_BASE_CLASS, className, {
                [styles[variant]]: useScss,
                [styles.disabled]: disabled && useScss,
                'disabled:(cursor-not-allowed opacity-50)': disabled && !useScss,
                'color-white border-none': variant === 'filled' && !useScss,
                'border-current border-solid border-1 bg-white': variant === 'outline' && !useScss,
                'bg-white border-none': variant === 'single' && !useScss,
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
