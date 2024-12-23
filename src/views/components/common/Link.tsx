import { background } from '@shared/messages';
import type { TextProps } from '@views/components/common/Text/Text';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import React from 'react';

type Props = TextProps<'a'> & {
    href?: string;
    disabled?: boolean;
};

/**
 * A reusable Text component with props that build on top of the design system for the extension
 */
export default function Link(props: PropsWithChildren<Props>): JSX.Element {
    const { className, href, ...passedProps } = props;

    if (href && !props.onClick) {
        passedProps.onClick = e => {
            e.preventDefault();
            background.openNewTab({ url: href });
        };
    }
    const isDisabled = props.disabled || (!href && !props.onClick);

    return (
        <Text
            color='bluebonnet'
            {...passedProps}
            as='a'
            aria-disabled={isDisabled}
            href={!isDisabled ? href : undefined}
            tabIndex={isDisabled ? -1 : 0}
            className={clsx(
                {
                    'underline cursor-pointer': !isDisabled,
                    'cursor-not-allowed color-ut-gray': isDisabled,
                },
                className
            )}
        />
    );
}
