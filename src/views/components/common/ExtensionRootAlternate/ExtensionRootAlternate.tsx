import 'uno.css';

import React from 'react';

import styles from '../ExtensionRoot/ExtensionRoot.module.scss';

interface Props {
    testId?: string;
}
/**
 * A wrapper component for the extension elements that adds some basic styling to them
 */
export default function ExtensionRootAlternate(props: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <div className={styles.extensionRoot} data-testid={props.testId}>
            {props.children}
        </div>
    );
}
