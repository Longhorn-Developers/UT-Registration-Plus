import type { CloseWrapper, ShowDialogFn } from '@views/contexts/DialogContext';
import { DialogContext } from '@views/contexts/DialogContext';
import type { ReactNode } from 'react';
import React, { useCallback, useRef, useState } from 'react';

import Dialog from '../Dialog';

type DialogElement = (show: boolean) => ReactNode;

function unwrapCloseWrapper<T>(obj: T | CloseWrapper<T>, close: () => void): T {
    if (typeof obj === 'function') {
        return (obj as CloseWrapper<T>)(close);
    }

    return obj;
}

// Unique ID counter is safe to be global
let nextId = 1;

/**
 * Allows descendant to show dialogs via a function, handling animations and stacking.
 */
export default function DialogProvider(props: { children: ReactNode }): JSX.Element {
    const [dialogQueue, setDialogQueue] = useState<DialogElement[]>([]);
    const dialogQueueRef = useRef() as React.MutableRefObject<DialogElement[]>;
    dialogQueueRef.current = dialogQueue;
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

            if (dialogQueueRef.current.length > 0) {
                setOpenDialog(dialogQueueRef.current[0]);
                setDialogQueue(prev => prev.slice(1));
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
            >
                {buttons}
            </Dialog>
        );

        if (openRef.current) {
            setDialogQueue(prev => [openRef.current!, ...prev]);
        }

        setOpenDialog(dialogElement);
        setIsOpen(true);
    }, []);

    return (
        <DialogContext.Provider value={showDialog}>
            {props.children}

            {openDialog?.(isOpen)}
        </DialogContext.Provider>
    );
}
