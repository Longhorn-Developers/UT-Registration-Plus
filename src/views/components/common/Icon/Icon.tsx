import type { Color } from '@views/styles/colors.module.scss';
import colors from '@views/styles/colors.module.scss';
import type { Size } from '@views/styles/fonts.module.scss';
import fonts from '@views/styles/fonts.module.scss';
import clsx from 'clsx';
import React from 'react';

import styles from './Icon.module.scss';
import type { MaterialIconCode } from './MaterialIcons';

/**
 * Props for the Icon component.
 */
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
export default function Icon(props: Props): JSX.Element {
    const style = props.style || {};

    style.color ??= colors?.[props.color ?? 'charcoal'];
    style.backgroundColor ??= props.backgroundColor ? colors?.[props.backgroundColor] : undefined;
    style.fontSize ??= fonts?.[`${props.size}_size`];
    style.fontWeight ??= fonts?.[`${props.weight ?? 'normal'}_weight`];

    return (
        <span
            data-testid={props.testId}
            style={style}
            className={clsx(styles.icon, props.className)}
            onClick={props.onClick}
        >
            {props.name}
        </span>
    );
}
