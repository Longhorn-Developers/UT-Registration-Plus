import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import { bMessenger } from 'src/shared/messages';
import Text, { TextProps } from '../Text/Text';
import styles from './Link.module.scss';

type Props = TextProps & {
    url?: string;
    disabled?: boolean;
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
        passedProps.onClick = () => bMessenger.openNewTab({ url });
    }

    return (
        <Text
            {...passedProps}
            className={classNames(
                styles.link,
                {
                    [styles.disabled]: props.disabled,
                },
                props.className
            )}
        />
    );
}
