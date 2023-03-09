import classNames from 'classnames';
import React from 'react';
import colors, { Color } from 'src/views/styles/colors.module.scss';
import fonts, { Size, Weight } from 'src/views/styles/fonts.module.scss';
import styles from './Icon.module.scss';
import { MaterialIconCode } from './MaterialIcons';

export type Props = {
    name: MaterialIconCode;
    className?: string;
    style?: React.CSSProperties;
    color?: Color;
    backgroundColor?: Color;
    weight?: 'normal' | 'bold';
    size?: Size | number;
    onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
    testId?: string;
};

/**
 * This is a reusable Icon component that uses the Material Icons Round font internally
 * You can find the list of icons here: https://fonts.google.com/icons?selected=Material+Icons+Round
 */
export default function Icon(props: Props) {
    const style = props.style || {};

    style.color ??= colors?.[props.color ?? 'charcoal'];
    style.backgroundColor ??= props.backgroundColor ? colors?.[props.backgroundColor] : undefined;
    style.fontSize ??= fonts?.[`${props.size}_size`];
    style.fontWeight ??= fonts?.[`${props.weight ?? 'normal'}_weight`];

    return (
        <span
            data-testid={props.testId}
            style={style}
            className={classNames(styles.icon, props.className)}
            onClick={props.onClick}
        >
            {props.name}
        </span>
    );
}
