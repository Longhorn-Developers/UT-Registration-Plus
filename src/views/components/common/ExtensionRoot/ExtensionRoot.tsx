// import '@unocss/reset/tailwind-compat.css';
import 'uno.css';

import type TabInfoMessages from '@shared/messages/TabInfoMessages';
import { MessageListener } from 'chrome-extension-toolkit';
import React from 'react';

import styles from './ExtensionRoot.module.scss';

interface Props {
    testId?: string;
}

const tabInfoListener = new MessageListener<TabInfoMessages>({
    getTabInfo: ({ sendResponse }) => {
        console.log('getTabInfo');
        sendResponse({
            url: window.location.href,
            title: document.title,
        });
    },
});

tabInfoListener.listen();

/**
 * A wrapper component for the extension elements that adds some basic styling to them
 */
export default function ExtensionRoot(props: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <div className={styles.extensionRoot} data-testid={props.testId}>
            {props.children}
        </div>
    );
}
