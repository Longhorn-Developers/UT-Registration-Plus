import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import colors, { Color } from 'src/views/styles/colors.module.scss';
import fonts, { Size, Weight } from 'src/views/styles/fonts.module.scss';
import styles from './Text.module.scss';

export type TextProps = {
    color?: Color;
    weight?: Weight;
    size?: Size;
    span?: boolean;
    className?: string;
    onClick?: () => void;
    title?: string;
    align?: React.CSSProperties['textAlign'];
    style?: React.CSSProperties;
};

/**
 * A reusable Text component with props that build on top of the design system for the extension
 */
export default function Text(props: PropsWithChildren<TextProps>) {
    const style: React.CSSProperties = {
        ...props.style,
        textAlign: props.align,
        color: props.color ? colors[props.color] : undefined,
    };

    const weightClass = `${props.weight ?? 'regular'}_weight`;
    const fontSizeClass = `${props.size ?? 'medium'}_size`;

    const className = classNames(styles.text, styles[weightClass], styles[fontSizeClass], props.className);

    if (props.span) {
        return (
            <span title={props.title} className={className} style={style} onClick={props.onClick}>
                {props.children}
            </span>
        );
    }

    return (
        <div title={props.title} className={className} style={style} onClick={props.onClick}>
            {props.children}
        </div>
    );
}
