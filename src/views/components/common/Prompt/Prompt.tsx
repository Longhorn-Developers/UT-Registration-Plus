import { Dialog, Transition } from '@headlessui/react';
import React from 'react';

import type { Button } from '../Button/Button';

export interface PromptDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    children?: React.ReactElement<typeof Button>[];
}

const PromptDialog: React.FC<PromptDialogProps> = ({
    isOpen,
    onClose,
    title,
    content,
    children,
}: PromptDialogProps) => (
    <Dialog open={isOpen} onClose={onClose}>
        <Dialog.Panel>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{content}</Dialog.Description>
            <div className='flex items-center justify-end gap-2'>{children}</div>
        </Dialog.Panel>
    </Dialog>
);

export default PromptDialog;
