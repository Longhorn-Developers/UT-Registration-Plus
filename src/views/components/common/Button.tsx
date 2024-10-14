import type { ThemeColor } from '@shared/types/ThemeColors';
import { getThemeColorHexByName, getThemeColorRgbByName } from '@shared/util/themeColors';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

import type IconComponent from '~icons/material-symbols';

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
                    color: colorHex,
                    backgroundColor: `rgb(${colorRgb} / var(--un-bg-opacity)`,
                } satisfies React.CSSProperties
            }
            className={clsx(
                'btn',
                {
                    'text-white! bg-opacity-100 hover:enabled:shadow-md active:enabled:shadow-sm shadow-black/20':
                        variant === 'filled',
                    'bg-opacity-0 border-current hover:enabled:bg-opacity-8 border': variant === 'outline',
                    'bg-opacity-0 border-none hover:enabled:bg-opacity-8': variant === 'single', // settings is the only "single"
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
            {Icon && <Icon className='h-6 w-6' />}
            {!isIconOnly && (
                <Text variant='h4' className='inline-flex translate-y-0.08 items-center gap-2'>
                    {children}
                </Text>
            )}
        </button>
    );
}
