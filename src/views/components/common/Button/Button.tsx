import clsx from 'clsx';
import React from 'react';
import { ThemeColor, getThemeColorHexByName, getThemeColorRgbByName } from '../../../../shared/util/themeColors';
import type IconComponent from '~icons/material-symbols';
import Text from '../Text/Text';

interface Props {
    className?: string;
    style?: React.CSSProperties;
    variant: 'filled' | 'outline' | 'single';
    onClick?: () => void;
    icon?: typeof IconComponent;
    disabled?: boolean;
    title?: string;
    color: ThemeColor;
}

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
    color,
    children,
}: React.PropsWithChildren<Props>): JSX.Element {
    const Icon = icon;
    const isIconOnly = !children && !!icon;
    const colorHex = getThemeColorHexByName(color);
    const colorRgb = getThemeColorRgbByName(color)?.join(' ');

    return (
        <button
            style={
                {
                    ...style,
                    '--color': colorHex,
                    '--bg-color-8': `rgba(${colorRgb} / 0.08)`,
                    '--shadow-color-15': `rgba(${colorRgb} / 0.15)`,
                    '--shadow-color-30': `rgba(${colorRgb} / 0.3)`,
                } as React.CSSProperties
            }
            className={clsx(
                'btn',
                {
                    'disabled:(cursor-not-allowed opacity-50)': disabled,
                    'color-white bg-[var(--color)] border-[var(--color)] hover:enabled:btn-shadow':
                        variant === 'filled',
                    'color-[var(--color)] bg-white border-current hover:enabled:btn-shade border border-solid':
                        variant === 'outline',
                    'color-[var(--color)] bg-white border-white hover:enabled:btn-shade': variant === 'single', // settings is the only "single"
                    'px-2 py-1.25': isIconOnly && variant !== 'outline',
                    'px-1.75 py-1.25': isIconOnly && variant === 'outline',
                    'px-3.75': variant === 'outline' && !isIconOnly,
                },
                className
            )}
            title={title}
            disabled={disabled}
            onClick={disabled ? undefined : onClick}
        >
            {icon && <Icon className='size-6' />}
            {!isIconOnly && (
                <Text variant='h4' className='translate-y-0.08'>
                    {children}
                </Text>
            )}
        </button>
    );
}
