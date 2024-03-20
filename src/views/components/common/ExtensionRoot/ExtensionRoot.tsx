// import '@unocss/reset/tailwind-compat.css';
import 'uno.css';

import type TabInfoMessages from '@shared/messages/TabInfoMessages';
import { MessageListener } from 'chrome-extension-toolkit';
import clsx from 'clsx';
import React, { useEffect } from 'react';

import styles from './ExtensionRoot.module.scss';

interface Props {
    testId?: string;
    className?: string;
}

/**
 * A wrapper component for the extension elements that adds some basic styling to them
 */
export default function ExtensionRoot(props: React.PropsWithChildren<Props>): JSX.Element {
    // TODO: move out of ExtensionRoot
    useEffect(() => {
        const tabInfoListener = new MessageListener<TabInfoMessages>({
            getTabInfo: ({ sendResponse }) => {
                sendResponse({
                    url: window.location.href,
                    title: document.title,
                });
            },
        });

        tabInfoListener.listen();

        return () => tabInfoListener.unlisten();
    }, []);

    return (
        <div
            className={clsx(styles.extensionRoot, 'group/screenshot_hidden', props.className)}
            data-testid={props.testId}
        >
            {props.children}
        </div>
    );
}
