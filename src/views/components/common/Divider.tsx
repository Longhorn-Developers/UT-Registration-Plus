import clsx from 'clsx';
import React from 'react';

/**
 * Props for the Divider component
 *
 * @param orientation - Orientation of the divider (horizontal or vertical)
 * @param size - Size of the divider (forwards to width or height in CSS)
 * @param className - Additional classes to be added to the divider
 * @param testId - Test id for the divider
 */
export type DividerProps = {
    orientation: 'horizontal' | 'vertical';
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
 * <Divider size="2.5rem" orientation="vertical" />
 * ```
 *
 * @example
 * ```tsx
 * <Divider size="19px" orientation="horizontal" />
 * ```
 */
export default function Divider({ className, testId, size, orientation }: DividerProps): JSX.Element {
    const style: React.CSSProperties =
        orientation === 'horizontal'
            ? { width: size, borderBottomWidth: '1px' }
            : { height: size, borderRightWidth: '1px' };

    return (
        <div
            style={style}
            data-testid={testId}
            className={clsx('border-solid border-ut-offwhite/50 w-0 h-0', className)}
        />
    );
}
