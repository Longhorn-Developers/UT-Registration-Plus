// import '@unocss/reset/tailwind-compat.css';
import 'uno.css';

import clsx from 'clsx';
import React from 'react';

import styles from './ExtensionRoot.module.scss';

interface Props {
    testId?: string;
    className?: string;
}

/**
 * A wrapper component for the extension elements that adds some basic styling to them
 */
export default function ExtensionRoot(props: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <React.StrictMode>
            <div className={clsx(styles.extensionRoot, props.className)} data-testid={props.testId}>
                {props.children}
            </div>
        </React.StrictMode>
    );
}
