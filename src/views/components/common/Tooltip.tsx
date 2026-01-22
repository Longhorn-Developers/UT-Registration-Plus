import clsx from 'clsx';
import type { PropsWithChildren, ReactNode } from 'react';
import React from 'react';

interface TooltipProps {
    className?: string;
    contentClassName?: string;
    content: ReactNode;
    offsetX: number;
    offsetY: number;
    maxWidth?: number;
}

/**
 * Tooltip that displays content on hover
 */
export default function Tooltip({
    className,
    contentClassName,
    content,
    offsetX,
    offsetY,
    maxWidth,
    children,
}: PropsWithChildren<TooltipProps>): JSX.Element {
    return (
        <span className={clsx('relative inline-flex group', className)}>
            {children}
            <span
                className={clsx(
                    'pointer-events-none absolute rounded-md bg-white px-3 py-2 text-xs invisible opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 whitespace-normal break-words',
                    contentClassName
                )}
                style={{
                    marginTop: offsetY,
                    marginLeft: offsetX,
                    maxWidth,
                }}
            >
                {content}
            </span>
        </span>
    );
}
