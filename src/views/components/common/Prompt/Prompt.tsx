import { Dialog } from '@headlessui/react';
import React from 'react';

import type { Button } from '../Button/Button';
import type Text from '../Text/Text';

export interface PromptDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactElement<typeof Text>;
    content: React.ReactElement<typeof Text>;
    children?: React.ReactElement<typeof Button>[];
}

function PromptDialog({ isOpen, onClose, title, content, children }: PromptDialogProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
            <div className='fixed inset-0 bg-black bg-opacity-50' aria-hidden='true' />
            <div className='fixed inset-0 w-screen flex items-center justify-center'>
                <Dialog.Panel className='h-[180] w-[409px] flex flex-col rounded bg-white p-6'>
                    <Dialog.Title className='mb-[10px]'>{title}</Dialog.Title>
                    <Dialog.Description className='mb-[13px]'>{content}</Dialog.Description>
                    <div className='flex items-center justify-end gap-2'>{children}</div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

export default PromptDialog;
