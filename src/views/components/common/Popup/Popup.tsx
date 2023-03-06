import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import styles from './Popup.module.scss';

interface Props {
    testId?: string;
    style?: React.CSSProperties;
    className?: string;
    /** Should it display a subtle dark overlay over the rest of the screen */
    overlay?: boolean;
}

/**
 *
 */
export default function Popup(props: PropsWithChildren<Props>) {
    return (
        <div
            style={props.style}
            className={classNames(styles.container, {
                [styles.overlay]: props.overlay,
            })}
            data-testid={props.testId}
        >
            <div className={classNames(styles.body, props.className)}>{props.children}</div>
        </div>
    );
}
