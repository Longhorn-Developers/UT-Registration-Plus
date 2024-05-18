import type { CloseWrapper, DialogInfo, ShowDialogFn } from '@views/contexts/DialogContext';
import { DialogContext, useDialog } from '@views/contexts/DialogContext';
import type { ReactNode } from 'react';
import React, { useCallback, useRef, useState } from 'react';

import Dialog from '../Dialog';
import Text from '../Text/Text';

type DialogElement = (show: boolean) => ReactNode;
export interface PromptInfo extends Omit<DialogInfo, 'buttons' | 'className' | 'title' | 'description'> {
    title: JSX.Element | string;
    description: JSX.Element | string;
    onClose?: () => void;
    buttons: NonNullable<DialogInfo['buttons']>;
}

function unwrapCloseWrapper<T>(obj: T | CloseWrapper<T>, close: () => void): T {
    if (typeof obj === 'function') {
        return (obj as CloseWrapper<T>)(close);
    }

    return obj;
}

export function usePrompt(): (info: PromptInfo) => void {
    const showDialog = useDialog();

    return (info: PromptInfo) => {
        showDialog({
            ...info,
            title: (
                <Text variant='h2' as='h1'>
                    {info.title}
                </Text>
            ),
            description: (
                <Text variant='p' as='p'>
                    {info.description}
                </Text>
            ),
            className: 'max-w-[400px] flex flex-col gap-3 p-6.25',
        });
    };
}

// Unique ID counter is safe to be global
let nextId = 1;

/**
 * Allows descendant to show dialogs via a function, handling animations and stacking.
 */
export default function DialogProvider(props: { children: ReactNode }): JSX.Element {
    const dialogQueue = useRef<DialogElement[]>([]);
    const [openDialog, setOpenDialog] = useState<DialogElement | undefined>();
    const openRef = useRef<typeof openDialog>();
    openRef.current = openDialog;

    const [isOpen, setIsOpen] = useState(false);

    const showDialog = useCallback<ShowDialogFn>(info => {
        const id = nextId++;

        const handleClose = () => {
            setIsOpen(false);
        };

        const infoUnwrapped = unwrapCloseWrapper(info, handleClose);
        const buttons = unwrapCloseWrapper(infoUnwrapped.buttons, handleClose);

        const onLeave = () => {
            setOpenDialog(undefined);

            if (dialogQueue.current.length > 0) {
                const newOpen = dialogQueue.current.pop();
                setOpenDialog(() => newOpen);
                setIsOpen(true);
            }

            infoUnwrapped.onClose?.();
        };

        const dialogElement = (show: boolean) => (
            <Dialog
                key={id}
                onClose={handleClose}
                afterLeave={onLeave}
                title={infoUnwrapped.title}
                description={infoUnwrapped.description}
                appear
                show={show}
                initialFocusHidden={infoUnwrapped.initialFocusHidden}
                className={infoUnwrapped.className}
            >
                <div className='w-full flex justify-end gap-2.5'>{buttons}</div>
            </Dialog>
        );

        if (openRef.current) {
            dialogQueue.current.push(openRef.current);
        }

        setOpenDialog(() => dialogElement);
        setIsOpen(true);
    }, []);

    return (
        <DialogContext.Provider value={showDialog}>
            {props.children}

            {openDialog?.(isOpen)}
        </DialogContext.Provider>
    );
}
