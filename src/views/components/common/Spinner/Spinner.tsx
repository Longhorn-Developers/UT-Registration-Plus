import clsx from 'clsx';
import React from 'react';
import styles from './Spinner.module.scss';

type Props = {
    testId?: string;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * A simple spinner component that can be used to indicate loading.
 */
export default function Spinner({ className, testId, style }: Props) {
    return <div data-testid={testId} style={style} className={clsx(styles.spinner, className)} />;
}
