import { Input as HInput, type InputProps } from '@headlessui/react';
import type { Icon, IconProps } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

interface Props extends InputProps {
    icon?: Icon;
    iconProps?: IconProps;
}

/**
 * A reusable input component that follows the design system of the extension.
 * @returns
 */
function Input(
    { className, icon, iconProps, ...props }: Props,
    ref: React.ForwardedRef<HTMLInputElement>
): JSX.Element {
    const Icon = icon;
    return (
        <div className={clsx('h-9 flex flex-row items-center justify-between gap-spacing-5', className)}>
            {Icon && (
                <div className='h-7 w-7'>
                    <Icon {...iconProps} className={clsx('h-7 w-7', iconProps?.className)} />
                </div>
            )}
            <HInput
                {...props}
                ref={ref}
                className={clsx(
                    'h-full w-full px-spacing-4 bg-transparent disabled:bg-ut-offwhite/20 text-[1rem]',
                    'border border-ut-offwhite/50 border-rounded focus:outline-none focus:ring-0'
                )}
            />
        </div>
    );
}

export default React.forwardRef(Input);
