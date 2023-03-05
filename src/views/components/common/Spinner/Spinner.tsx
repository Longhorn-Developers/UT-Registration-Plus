import React from 'react';
import { ISassColors } from 'src/views/styles/colors.module.scss';
import styles from './Spinner.module.scss';

type Props = {
    color?: keyof ISassColors;
};

/**
 * A simple spinner component that can be used to indicate loading.
 */
export default function Spinner({ color }: Props) {
    return <div className={styles.spinner} />;
}
