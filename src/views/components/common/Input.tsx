import { Input as HInput } from '@headlessui/react';
import type { Icon, IconProps } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

interface Props {
    className?: string;
    placeholder?: string;
    type?: typeof HInput.prototype.type;
    value: typeof HInput.prototype.value;
    onChange?: typeof HInput.prototype.onChange;
    icon?: Icon;
    iconProps?: IconProps;
    disabled?: boolean;
    maxLength?: number;
}

/**
 * A reusable input component that follows the design system of the extension.
 * @returns
 */
export default function Input({
    className,
    placeholder,
    value,
    onChange,
    icon,
    iconProps,
    disabled,
    maxLength,
    ...props
}: React.PropsWithChildren<Props>): JSX.Element {
    const Icon = icon;
    return (
        <div className={clsx('w-full h-9 flex flex-row items-center justify-between gap-spacing-5', className)}>
            {Icon && (
                <div className='h-7 w-7'>
                    {Icon && <Icon {...iconProps} className={clsx('h-7 w-7', iconProps?.className)} />}
                </div>
            )}
            <HInput
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className={clsx(
                    'h-full w-full px-spacing-4 bg-transparent disabled:bg-ut-offwhite/20 text-[1rem]',
                    'border border-ut-offwhite/50 border-rounded focus:outline-none focus:ring-0'
                )}
                disabled={disabled}
                maxLength={maxLength}
                {...props}
            />
        </div>
    );
}
