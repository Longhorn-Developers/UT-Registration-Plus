import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import type { JSX, ReactNode } from 'react';
import CheckIcon from '~icons/ph/check';
import InfoIcon from '~icons/ph/info';
import WarningCircleIcon from '~icons/ph/warning-circle';
import XIcon from '~icons/ph/x';

export type ToastType = 'success' | 'info' | 'warning';

export interface ToastProps {
    message: ReactNode;
    type?: ToastType;
    onClose?: () => void;
    className?: string;
}

const borderColors: Record<ToastType, string> = {
    success: 'border-l-ut-green',
    info: 'border-l-ut-blue',
    warning: 'border-l-ut-burntorange',
};

const iconColors: Record<ToastType, string> = {
    success: 'text-ut-green',
    info: 'text-ut-blue',
    warning: 'text-ut-burntorange',
};

export default function Toast({ message, type = 'info', onClose, className }: ToastProps): JSX.Element {
    const Icon = type === 'success' ? CheckIcon : type === 'warning' ? WarningCircleIcon : InfoIcon;

    return (
        <div
            role='status'
            aria-live='polite'
            className={clsx(
                'pointer-events-auto flex items-center gap-2.5 rounded-r-md border border-gray-200 border-l-4 bg-white px-3.5 py-2.5 shadow-lg',
                borderColors[type],
                className
            )}
        >
            <Icon className={clsx('h-4.5 w-4.5 shrink-0', iconColors[type])} />
            <Text variant='small' className='text-ut-black font-medium'>
                {message}
            </Text>
            {onClose && (
                <button
                    type='button'
                    onClick={onClose}
                    className='ml-1 text-gray-400 hover:text-ut-black transition-colors'
                    aria-label='Close notification'
                >
                    <XIcon className='h-3.5 w-3.5' />
                </button>
            )}
        </div>
    );
}
