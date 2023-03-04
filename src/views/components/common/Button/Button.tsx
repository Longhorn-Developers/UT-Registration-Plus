import React from 'react';
import styles from './Button.module.scss';

interface Props {
    onClick?: () => void;
}

export function Button(props: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <button className={styles.button} onClick={props.onClick}>
            {props.children}
        </button>
    );
}
