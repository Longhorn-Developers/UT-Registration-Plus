import type { CloseWrapper, ShowDialogFn } from '@views/contexts/DialogContext';
import { DialogContext } from '@views/contexts/DialogContext';
import type { ReactNode } from 'react';
import React, { useCallback, useState } from 'react';

import Dialog from '../Dialog';

type DialogElement = {
    id: number;
    manuallyClosed: boolean;
    dialog: (show: boolean) => ReactNode;
};

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
    const [openDialogs, setOpenDialogs] = useState<DialogElement[]>([]);

    const showDialog = useCallback<ShowDialogFn>(info => {
        const id = nextId++;

        const handleClose = () => {
            setOpenDialogs(prev => prev.map(d => (d.id === id ? { ...d, manuallyClosed: true } : d)));
        };

        const infoUnwrapped = unwrapCloseWrapper(info, handleClose);
        const buttons = unwrapCloseWrapper(infoUnwrapped.buttons, handleClose);

        const onLeave = () => {
            setOpenDialogs(prev =>
                prev.filter(d => {
                    if (d.id === id && d.manuallyClosed) {
                        infoUnwrapped.onClose?.();
                        return false;
                    }
                    return true;
                })
            );
        };

        setOpenDialogs(prev => [
            ...prev,
            {
                id,
                manuallyClosed: false,
                // eslint-disable-next-line react/no-unstable-nested-components
                dialog: show => (
                    <Dialog
                        key={id}
                        onClose={handleClose}
                        afterLeave={onLeave}
                        title={infoUnwrapped.title}
                        description={infoUnwrapped.description}
                        style={{ zIndex: 100 + id }}
                        appear
                        show={show}
                        initialFocusHidden={!infoUnwrapped.showFocus}
                    >
                        {buttons}
                    </Dialog>
                ),
            },
        ]);
    }, []);

    const currentId = openDialogs.findLast(d => !d.manuallyClosed)?.id ?? -1;

    console.log('length', openDialogs.length);

    return (
        <DialogContext.Provider value={showDialog}>
            {props.children}

            {openDialogs.map(dialog => dialog.dialog(dialog.id === currentId))}
        </DialogContext.Provider>
    );
}
