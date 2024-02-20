import clsx from 'clsx';
import React from 'react';

/**
 * Props for the Divider component
 *
 * @param variant - Orientation of the divider (horizontal or vertical)
 * @param size - Size of the divider (forwards to width or height in CSS)
 * @param className - Additional classes to be added to the divider
 * @param testId - Test id for the divider
 */
export type DividerProps = {
    variant: 'horizontal' | 'vertical';
    size: React.CSSProperties['width' | 'height'];
    className?: string;
    testId?: string;
};

/**
 * This is a reusable divider component that can be used to separate content
 *
 * @returns A divider component
 *
 * @example
 * ```tsx
 * <Divider size="2.5rem" variant="vertical" />
 * ```
 *
 * @example
 * ```tsx
 * <Divider size="19px" variant="horizontal" />
 * ```
 */
export default function Divider({ className, testId, size, variant }: DividerProps) {
    const style: React.CSSProperties =
        variant === 'horizontal'
            ? { width: size, borderBottomWidth: '1px' }
            : { height: size, borderRightWidth: '1px' };

    return <div style={style} data-testid={testId} className={clsx('divider', className)} />;
}
