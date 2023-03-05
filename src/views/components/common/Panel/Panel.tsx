import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import styles from './Panel.module.scss';

interface Props {
    testId?: string;
    style?: React.CSSProperties;
    className?: string;
    overlay?: boolean;
}

/**
 *
 */
export default function Panel(props: PropsWithChildren<Props>) {
    return (
        <div
            style={props.style}
            className={classNames(
                styles.container,
                {
                    [styles.overlay]: props.overlay,
                },
                props.className
            )}
            data-testid={props.testId}
        >
            <div className={styles.body}>{props.children}</div>
        </div>
    );
}
