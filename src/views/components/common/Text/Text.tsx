import type { PropsOf, ReactTag } from '@headlessui/react/dist/types';
import clsx from 'clsx';
import type { ElementType, ReactNode } from 'react';
import React from 'react';

import styles from './Text.module.scss';

type PropsWeControl = 'as' | 'children';
type CleanProps<TTag extends ReactTag, TOmitableProps extends PropertyKey = never> = Omit<
    PropsOf<TTag>,
    TOmitableProps | PropsWeControl
>;
type OurProps<TTag extends ReactTag> = {
    as?: TTag;
    children?: ReactNode;
};

type AsProps<TTag extends ReactTag, TOverrides = {}> = CleanProps<TTag, keyof TOverrides> & OurProps<TTag> & TOverrides;

const variants = ['mini', 'small', 'p', 'h4', 'h3-course', 'h3', 'h2-course', 'h2', 'h1-course', 'h1'] as const;

type Variant = (typeof variants)[number];

/**
 * Props for the Text component.
 */
export type TextProps<TTag extends ElementType = 'span'> = PropsOf<TTag>['className'] extends string
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
export default function Text<TTag extends ElementType = 'span'>({
    as,
    className,
    variant,
    ...rest
}: TextProps<TTag>): JSX.Element {
    const Comp = as || 'span';
    const mergedClassName = clsx(styles.text, styles[variant || 'p'], className);

    return <Comp className={mergedClassName} {...rest} />;
}
