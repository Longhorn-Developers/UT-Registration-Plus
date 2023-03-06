import classNames from 'classnames';
import React, { Component } from 'react';
import styles from './Card.module.scss';

export type Props = {
    style?: React.CSSProperties;
    className?: string;
    onClick?: (...args) => void;
    children?: React.ReactNode;
    testId?: string;
};

/**
 * A reusable Card component that can be used to wrap other components
 */
export default function Card(props: Props) {
    return (
        <div
            style={props.style}
            className={classNames(styles.card, props.className)}
            onClick={props.onClick}
            data-testid={props.testId}
        >
            {props.children}
        </div>
    );
}
