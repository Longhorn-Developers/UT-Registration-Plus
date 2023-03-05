import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import colors, { ISassColors } from 'src/views/styles/colors.module.scss';
import fonts, { ISizes, IWeights } from 'src/views/styles/fonts.module.scss';
import styles from './Text.module.scss';

type Props = {
    color?: keyof ISassColors;
    weight: keyof IWeights;
    size: keyof ISizes;
    span?: boolean;
    className?: string;
    onClick?: () => void;
    align?: React.CSSProperties['textAlign'];
    style?: React.CSSProperties;
};

/**
 * A reusable Text component with props that build on top of the design system for the extension
 */
export default function Text(props: PropsWithChildren<Props>) {
    const style = props.style || {};

    style.textAlign ??= props.align;
    style.color ??= colors?.[props.color ?? 'charcoal'];
    style.fontSize ??= fonts?.[props.size ?? 'medium'];
    style.fontWeight ??= fonts?.[props.weight ?? 'regular'];

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
