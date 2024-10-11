import { createContext, useContext } from 'react';

/**
 * Close wrapper
 */
export type CloseWrapper<T> = (close: () => void) => T;

/**
 * Information about a dialog.
 */
export interface DialogInfo {
    title?: string | JSX.Element;
    description?: string | JSX.Element;
    className?: string;
    buttons?: JSX.Element | CloseWrapper<JSX.Element>;
    onClose?: () => void;
}

/**
 * Function to show a dialog.
 */
export type ShowDialogFn = (info: DialogInfo | CloseWrapper<DialogInfo>) => void;

/**
 * Context for the dialog provider.
 */
export const DialogContext = createContext<ShowDialogFn>(() => {
    throw new Error('DialogContext not initialized.');
});

/**
 * @returns The dialog context for showing dialogs.
 */
export const useDialog = () => useContext(DialogContext);
