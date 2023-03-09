import React from 'react';
import classnames from 'classnames';
import { Color } from 'src/views/styles/colors.module.scss';
import styles from './Divider.module.scss';

export type Props = {
    color?: Color | React.CSSProperties['borderColor'];
    type?: 'solid' | 'dashed' | 'dotted';
    style?: React.CSSProperties;
    className?: string;
    testId?: string;
};

/**
 * This is a reusable divider component that can be used to separate content
 */
export default function Divider(props: Props) {
    const style = {
        ...props.style,
        borderColor: props.color,
        borderStyle: props.type,
    };

    return <hr data-testid={props.testId} style={style} className={classnames(styles.divider, props.className)} />;
}
