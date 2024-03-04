import { background } from '@shared/messages';
import type { TextProps } from '@views/components/common/Text/Text';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import React from 'react';

import styles from './Link.module.scss';

type Props = Omit<TextProps, 'span'> & {
    url?: string;
    disabled?: boolean;
    title?: string;
};

/**
 * A reusable Text component with props that build on top of the design system for the extension
 */
export default function Link(props: PropsWithChildren<Props>): JSX.Element {
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
