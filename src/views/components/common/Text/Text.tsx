import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import styles from './Text.module.scss';

/**
 *
 */
export type TextProps = {
    variant?: Variant;
    onClick?: () => void;
    title?: string;
    align?: React.CSSProperties['textAlign'];
    style?: React.CSSProperties;
    className?: string;
};

const variants = ['mini', 'small', 'p', 'h4', 'h3-course', 'h3', 'h2-course', 'h2', 'h1-course', 'h1'] as const;

type Variant = (typeof variants)[number];

/**
 * A reusable Text component with props that build on top of the design system for the extension
 */
export default function Text(props: PropsWithChildren<TextProps>) {
    const style: React.CSSProperties = {
        ...props.style,
        textAlign: props.align,
    };

    const className = classNames(styles.text, styles[props.variant], props.className);

    return (
        <span title={props.title} className={className} style={style} onClick={props.onClick}>
            {props.children}
        </span>
    );
}
