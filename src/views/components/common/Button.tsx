import type { Icon, IconProps } from '@phosphor-icons/react';
import type { ThemeColor } from '@shared/types/ThemeColors';
import { getThemeColorHexByName, getThemeColorRgbByName } from '@shared/util/themeColors';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

interface Props {
    className?: string;
    style?: React.CSSProperties;
    variant: 'filled' | 'outline' | 'minimal' | 'minimal-small';
    onClick?: () => void;
    icon?: Icon;
    iconProps?: IconProps;
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
    iconProps,
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
                    'text-white! bg-opacity-100 hover:enabled:shadow-md active:enabled:shadow-sm shadow-black/20 px-spacing-5 gap-spacing-3 h-[40px]':
                        variant === 'filled',
                    'bg-opacity-0 border-current hover:enabled:bg-opacity-8 border stroke-width-[1px] px-spacing-5 gap-spacing-3 h-[40px]':
                        variant === 'outline',
                    'bg-opacity-0 border-none hover:enabled:bg-opacity-8  px-spacing-5 gap-spacing-3 h-[40px]':
                        variant === 'minimal',
                    'bg-opacity-0 border-none hover:enabled:bg-opacity-8 text-sm px-spacing-3 gap-spacing-3 h-[35px]':
                        variant === 'minimal-small',
                    'px-spacing-3':
                        isIconOnly && (variant === 'filled' || variant === 'outline' || variant === 'minimal'),
                    'px-0 py-0 h-6 w-6': isIconOnly && variant === 'minimal-small',
                },
                className
            )}
            title={title}
            disabled={disabled}
            onClick={disabled ? undefined : onClick}
        >
            {Icon && <Icon {...iconProps} className={clsx('h-6 w-6', iconProps?.className)} />}
            {!isIconOnly && (
                <Text variant='h4' className='inline-flex translate-y-0.08 items-center gap-2'>
                    {children}
                </Text>
            )}
        </button>
    );
}
