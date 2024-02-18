import { background } from '@shared/messages';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import React from 'react';

import type { TextProps } from '../Text/Text';
import Text from '../Text/Text';
import styles from './Link.module.scss';

type Props = Omit<TextProps, 'span'> & {
    url?: string;
    disabled?: boolean;
    title?: string;
};

/**
 * A reusable Text component with props that build on top of the design system for the extension
 */
export default function Link(props: PropsWithChildren<Props>) {
    let passedProps = {
        ...props,
    };
    const { url } = props;

    if (url && !props.onClick) {
        passedProps.onClick = () => background.openNewTab({ url });
    }
    const isDisabled = props.disabled || (!url && !props.onClick);

    return (
        <Text
            color='bluebonnet'
            {...passedProps}
            as='span'
            className={clsx(
                styles.link,
                {
                    [styles.disabled]: isDisabled,
                },
                props.className
            )}
        />
    );
}
