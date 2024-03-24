import type { CloseWrapper, DialogInfo, ShowDialogFn } from '@views/contexts/DialogContext';
import { DialogContext } from '@views/contexts/DialogContext';
import type { ReactNode } from 'react';
import React, { useCallback, useState } from 'react';

import Dialog from '../Dialog';

type SillyDialog = {
    id: number;
    info: DialogInfo | CloseWrapper<DialogInfo>;
};

/**
 *
 */
export default function DialogProvider(props: { children: ReactNode }): JSX.Element {
    const [numDialogs, setNumDialogs] = useState(0);
    const [openDialogs, setOpenDialogs] = useState<SillyDialog[]>([]);

    const showDialog = useCallback<ShowDialogFn>(
        info => {
            setNumDialogs(prev => prev + 1);

            setOpenDialogs(prev => [
                ...prev,
                {
                    id: numDialogs,
                    info,
                },
            ]);
        },
        [setNumDialogs, setOpenDialogs, numDialogs]
    );

    return (
        <DialogContext.Provider value={showDialog}>
            {props.children}
            {openDialogs.map(dialog => {
                const { id } = dialog;

                const onClose = () => {
                    setOpenDialogs(prev => prev.filter(d => d.id !== id));
                };

                let title: JSX.Element | undefined;
                let description: JSX.Element | undefined;
                let buttons: JSX.Element | CloseWrapper<JSX.Element> | undefined;
                if (typeof dialog.info === 'function') {
                    title = dialog.info(onClose).title;
                    description = dialog.info(onClose).description;
                    buttons = dialog.info(onClose).buttons;
                } else {
                    title = dialog.info.title;
                    description = dialog.info.description;
                    buttons = dialog.info.buttons;
                }

                if (typeof buttons === 'function') {
                    buttons = buttons(onClose);
                }

                return (
                    <Dialog
                        key={id}
                        onClose={onClose}
                        title={title}
                        description={description}
                        style={{ zIndex: 100 + id * 50 }}
                        show
                    >
                        {buttons}
                    </Dialog>
                );
            })}
        </DialogContext.Provider>
    );
}
