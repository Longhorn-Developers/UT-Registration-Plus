import type { CloseWrapper, DialogInfo, DialogOptions, ShowDialogFn } from '@views/contexts/DialogContext';
import { DialogContext, useDialog } from '@views/contexts/DialogContext';
import type { ReactNode } from 'react';
import React, { useCallback, useRef, useState } from 'react';

import Dialog from '../Dialog';
import Text from '../Text/Text';

type DialogElement = (show: boolean) => ReactNode;

/**
 * Represents information for a prompt dialog
 */
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

/**
 * Hook to show prompt with default stylings.
 */
export function usePrompt(): (info: PromptInfo, options?: DialogOptions) => void {
    const showDialog = useDialog();

    return (info, options) => {
        showDialog(
            {
                ...info,
                title: (
                    <Text variant='h2' as='h1' className='text-theme-black'>
                        {info.title}
                    </Text>
                ),
                description: (
                    <Text variant='p' as='p' className='text-ut-black'>
                        {info.description}
                    </Text>
                ),
                className: 'max-w-[400px] flex flex-col gap-2.5 p-6.25',
            },
            options
        );
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

    const showDialog = useCallback<ShowDialogFn>((info, options) => {
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
                onClose={(options?.closeOnClickOutside ?? true) ? handleClose : () => {}}
                afterLeave={onLeave}
                title=<>{infoUnwrapped.title}</>
                description=<>{infoUnwrapped.description}</>
                appear={!(options?.immediate ?? false)}
                show={show}
                className={infoUnwrapped.className}
            >
                <div className='mt-0.75 w-full flex justify-end gap-2.5'>{buttons}</div>
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
