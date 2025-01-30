import type { PropsOf, ReactTag } from '@headlessui/react/dist/types';
import styles from '@views/components/common/Text/Text.module.scss';
import clsx from 'clsx';
import type { ElementType, ReactNode, Ref } from 'react';
import React from 'react';

type PropsWeControl = 'as' | 'children';
type CleanProps<TTag extends ReactTag, TOmitableProps extends PropertyKey = never> = Omit<
    PropsOf<TTag>,
    TOmitableProps | PropsWeControl
>;
type OurProps<TTag extends ReactTag> = {
    as?: TTag;
    children?: ReactNode;
    ref?: React.ForwardedRef<React.ElementRef<TTag>>;
};

type AsProps<TTag extends ReactTag, TOverrides = object> = CleanProps<TTag, keyof TOverrides> &
    OurProps<TTag> &
    TOverrides;

const variants = ['mini', 'small', 'p', 'h4', 'h3-course', 'h3', 'h2-course', 'h2', 'h1-course', 'h1'] as const;

type Variant = (typeof variants)[number];

/**
 * Props for the Text component.
 */
export type TextProps<TTag extends ElementType = 'span'> =
    NonNullable<PropsOf<TTag>['className']> extends string
        ? AsProps<
              TTag,
              {
                  variant?: Variant;
              }
          >
        : never;

/**
 * A reusable Text component with props that build on top of the design system for the extension
 */
function Text<TTag extends ElementType = 'span'>(
    { as, className, variant, ...rest }: TextProps<TTag>,
    ref: Ref<HTMLElement>
): JSX.Element {
    const Comp = as || 'span';
    const mergedClassName = clsx(styles.text, styles[variant || 'p'], className);

    return <Comp className={mergedClassName} {...rest} ref={ref} />;
}

export default React.forwardRef(Text) as <TTag extends ElementType = 'span'>(props: TextProps<TTag>) => JSX.Element;
