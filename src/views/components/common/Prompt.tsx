import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import type { ReactElement } from 'react';
import React from 'react';

import type { Button } from './Button';
import type Text from './Text/Text';

/**
 * Props for the PromptDialog component.
 */
export interface PromptDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: ReactElement<typeof Text>;
    content: ReactElement<typeof Text>;
    children?: ReactElement<typeof Button>[];
}

/**
 * A reusable dialog component that can be used to display a prompt to the user.
 * @param {PromptDialogProps} props.isOpen - Whether the dialog is open or not.
 * @param {Function} props.onClose - A function to call when the user exits the dialog.
 * @param {React.ReactElement<typeof Text>} props.title - The title of the dialog.
 * @param {React.ReactElement<typeof Text>} props.content - The content of the dialog.
 * @param {React.ReactElement<typeof Button>[]} props.children - The buttons to display in the dialog.
 */
function PromptDialog({ isOpen, onClose, title, content, children }: PromptDialogProps) {
    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as='div' onClose={onClose} className='relative z-50'>
                <TransitionChild
                    as={React.Fragment}
                    enter='ease-out duration-200'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black bg-opacity-50' aria-hidden='true' />
                </TransitionChild>

                <TransitionChild
                    as={React.Fragment}
                    enter='ease-out duration-200'
                    enterFrom='opacity-0 scale-95'
                    enterTo='opacity-100 scale-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100 scale-100'
                    leaveTo='opacity-0 scale-95'
                >
                    <div className='fixed inset-0 w-screen flex items-center justify-center'>
                        <Dialog.Panel className='h-[200] w-[431px] flex flex-col rounded bg-white p-6'>
                            <Dialog.Title className='mb-[10px]'>{title}</Dialog.Title>
                            <Dialog.Description className='mb-[13px]'>{content}</Dialog.Description>
                            <div className='flex items-center justify-end gap-2'>{children}</div>
                        </Dialog.Panel>
                    </div>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}

export default PromptDialog;
