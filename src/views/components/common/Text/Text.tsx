import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import styles from './Text.module.scss';

/**
 *
 */
export type TextProps = {
    variant?: Variant;
} & (
    | (React.HTMLAttributes<HTMLSpanElement> & { as?: 'span' })
    | (React.HTMLAttributes<HTMLDivElement> & { as: 'div' })
);

const variants = ['mini', 'small', 'p', 'h4', 'h3-course', 'h3', 'h2-course', 'h2', 'h1-course', 'h1'] as const;

type Variant = (typeof variants)[number];

/**
 * A reusable Text component with props that build on top of the design system for the extension
 */
export default function Text({ variant, as, className, ...props }: PropsWithChildren<TextProps>) {
    const mergedClassName = clsx(styles.text, styles[variant], className);

    if (as === 'div') return <div className={mergedClassName} {...props} />;

    return (
        <span className={mergedClassName} {...props}>
            {props.children}
        </span>
    );
}
