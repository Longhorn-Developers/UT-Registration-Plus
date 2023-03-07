import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import colors, { Color } from 'src/views/styles/colors.module.scss';
import fonts, { Size, Weight } from 'src/views/styles/fonts.module.scss';
import styles from './Text.module.scss';

export type TextProps = {
    color?: Color;
    weight?: Weight;
    size: Size;
    span?: boolean;
    className?: string;
    onClick?: () => void;
    align?: React.CSSProperties['textAlign'];
    style?: React.CSSProperties;
};

/**
 * A reusable Text component with props that build on top of the design system for the extension
 */
export default function Text(props: PropsWithChildren<TextProps>) {
    const style = props.style || {};

    style.textAlign ??= props.align;
    style.color ??= colors?.[props.color ?? 'charcoal'];
    style.fontSize ??= fonts?.[`${props.size ?? 'medium'}_size`];
    style.fontWeight ??= fonts?.[`${props.weight ?? 'regular'}_weight`];
    style.lineHeight ??= fonts?.[`${props.size ?? 'medium'}_line_height`];

    if (props.span) {
        return (
            <span className={classNames(styles.text, props.className)} style={style} onClick={props.onClick}>
                {props.children}
            </span>
        );
    }

    return (
        <div className={classNames(styles.text, props.className)} style={style} onClick={props.onClick}>
            {props.children}
        </div>
    );
}
