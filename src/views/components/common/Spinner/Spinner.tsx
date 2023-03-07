import React from 'react';
import { Color } from 'src/views/styles/colors.module.scss';
import styles from './Spinner.module.scss';

type Props = {
    color?: Color;
};

/**
 * A simple spinner component that can be used to indicate loading.
 */
export default function Spinner({ color }: Props) {
    return <div className={styles.spinner} />;
}
