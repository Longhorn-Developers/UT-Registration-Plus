import { Input as HInput, type InputProps } from '@headlessui/react';
import type { Icon, IconProps } from '@phosphor-icons/react';
import clsx from 'clsx';
import type { Ref } from 'react';

interface Props extends InputProps {
    icon?: Icon;
    iconProps?: IconProps;
    ref?: Ref<HTMLInputElement>;
}

/**
 * A reusable input component that follows the design system of the extension.
 */
export default function Input({ className, icon, iconProps, ref, ...props }: Props): React.JSX.Element {
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
                    'border border-ut-offwhite/50 border-rounded focusable'
                )}
            />
        </div>
    );
}
