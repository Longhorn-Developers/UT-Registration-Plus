import type { Icon, IconProps } from '@phosphor-icons/react';
import type { MIMETypeValue } from '@shared/types/MIMEType';
import type { ThemeColor } from '@shared/types/ThemeColors';
import { getThemeColorHexByName, getThemeColorRgbByName } from '@shared/util/themeColors';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React, { useEffect,useRef, useState } from 'react';

interface Props {
    className?: string;
    style?: React.CSSProperties;
    variant?: 'filled' | 'outline' | 'minimal';
    size?: 'regular' | 'small' | 'mini';
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: Icon;
    iconProps?: IconProps;
    disabled?: boolean;
    title?: string;
    color: ThemeColor;
    accept?: MIMETypeValue | MIMETypeValue[];
}

/**
 * A reusable input button component that follows Button.tsx consistency.
 * Now supports drag-and-drop file uploads (issue #446).
 */
export default function FileUpload({
    className,
    style,
    variant = 'filled',
    size = 'regular',
    onChange,
    icon,
    iconProps,
    disabled,
    title,
    color,
    accept,
    children,
}: React.PropsWithChildren<Props>): JSX.Element {
    const Icon = icon;
    const isIconOnly = !children && !!icon;
    const colorHex = getThemeColorHexByName(color);
    const colorRgb = getThemeColorRgbByName(color)?.join(' ');
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Convert accept array to comma-separated list
    const acceptValue = Array.isArray(accept) ? accept.join(',') : accept;

    // --- Prevent Chrome from opening the file on drop anywhere else ---
    useEffect(() => {
        const preventDefault = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
        };

        window.addEventListener('dragover', preventDefault);
        window.addEventListener('drop', preventDefault);

        return () => {
            window.removeEventListener('dragover', preventDefault);
            window.removeEventListener('drop', preventDefault);
        };
    }, []);
    // ------------------------------------------------------------------

    // --- Local drag and drop handlers for this button only -------------
    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        if (disabled) return;

        const file = event.dataTransfer.files?.[0];
        if (file && inputRef.current && onChange) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            inputRef.current.files = dataTransfer.files;

            // Trigger change event manually
            onChange({ target: inputRef.current } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };
    // ------------------------------------------------------------------

    return (
        <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
                ...style,
                color: disabled ? 'ut-gray' : colorHex,
                backgroundColor: `rgb(${colorRgb} / var(--un-bg-opacity))`,
            }}
            className={clsx(
                'btn transition-colors select-none',
                {
                    'ring-2 ring-offset-2 ring-blue-400': isDragging && !disabled,
                    'text-white! bg-opacity-100 hover:enabled:shadow-md active:enabled:shadow-sm shadow-black/20':
                        variant === 'filled',
                    'bg-opacity-0 border-current hover:enabled:bg-opacity-8 border stroke-width-[1px]':
                        variant === 'outline',
                    'bg-opacity-0 border-none hover:enabled:bg-opacity-8': variant === 'minimal',
                    'h-10 gap-spacing-3 px-spacing-5': size === 'regular' && !isIconOnly,
                    'h-10 w-10 p-spacing-2': size === 'regular' && isIconOnly,
                    'h-[35px] gap-spacing-3 px-spacing-3': size === 'small' && !isIconOnly,
                    'h-[35px] w-[35px] p-spacing-2': size === 'small' && isIconOnly,
                    'h-6 p-spacing-2': size === 'mini' && !isIconOnly,
                    'h-6 w-6 p-0': size === 'mini' && isIconOnly,
                    'opacity-60 cursor-not-allowed': disabled,
                },
                className
            )}
            title={title}
        >
            {Icon && <Icon {...iconProps} className={clsx('h-6 w-6', iconProps?.className)} />}
            {!isIconOnly && (
                <Text
                    variant={size === 'regular' ? 'h4' : 'small'}
                    className='inline-flex translate-y-0.08 items-center gap-2'
                >
                    {children}
                </Text>
            )}
            <input
                ref={inputRef}
                type='file'
                {...(accept ? { accept: acceptValue } : {})}
                className='hidden'
                disabled={disabled}
                onChange={disabled ? undefined : onChange}
            />
        </label>
    );
}
