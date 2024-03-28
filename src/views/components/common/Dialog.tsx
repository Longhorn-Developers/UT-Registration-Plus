import type { TransitionRootProps } from '@headlessui/react';
import { Dialog as HDialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import React, { Fragment } from 'react';

import ExtensionRoot from './ExtensionRoot/ExtensionRoot';

export interface _DialogProps {
    className?: string;
    title?: JSX.Element;
    description?: JSX.Element;
    initialFocusHidden?: boolean;
}

/**
 * Props for the Dialog component.
 */
export type DialogProps = _DialogProps & Omit<TransitionRootProps<typeof HDialog>, 'children'>;

/**
 * A reusable popup component that can be used to display content on the page
 */
export default function Dialog(props: PropsWithChildren<DialogProps>): JSX.Element {
    const { children, className, open, initialFocusHidden, ...rest } = props;
    const initialFocusHiddenRef = React.useRef<HTMLDivElement>(null);

    if (initialFocusHidden) {
        rest.initialFocus = initialFocusHiddenRef;
    }

    return (
        <Transition show={open} as={HDialog} {...rest}>
            <ExtensionRoot>
                <Transition.Child
                    as={Fragment}
                    enter='transition duration-300 motion-reduce:duration-150 ease-out'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='transition duration-150 ease-in delay-25'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className={clsx('fixed inset-0 z-50 bg-slate-700/35')} />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter='transition duration-375 motion-reduce:duration-0 ease-[cubic-bezier(0.05,0.4,0.2,1)]'
                    enterFrom='transform-gpu scale-95 opacity-0'
                    enterTo='transform-gpu scale-100 opacity-100'
                    leave='transition duration-250 motion-reduce:duration-0 ease-[cubic-bezier(0.23,0.01,0.92,0.72)]'
                    leaveFrom='transform-gpu scale-100 opacity-100'
                    leaveTo='transform-gpu scale-95 opacity-0'
                >
                    <div className='fixed inset-0 z-50 flex items-center justify-center'>
                        <HDialog.Panel
                            className={clsx(
                                'z-99 max-h-[90vh] flex flex-col overflow-y-auto border border-solid border-ut-offwhite rounded bg-white shadow-xl ml-[calc(100vw-100%)] mt-[calc(100vw-100%)]',
                                className
                            )}
                        >
                            {initialFocusHidden && <div className='hidden' ref={initialFocusHiddenRef} />}
                            {props.title && <HDialog.Title as={Fragment}>{props.title}</HDialog.Title>}
                            {props.description && (
                                <HDialog.Description as={Fragment}>{props.description}</HDialog.Description>
                            )}
                            {children}
                        </HDialog.Panel>
                    </div>
                </Transition.Child>
            </ExtensionRoot>
        </Transition>
    );
}
