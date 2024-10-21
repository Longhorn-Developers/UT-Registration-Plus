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
 * Options for configuring the behavior of a dialog.
 */
export interface DialogOptions {
    /**
     * Whether to show the dialog immediately.
     */
    immediate?: boolean;

    /**
     * Whether to allow the user to close the dialog by clicking outside of it. (Defaults to true)
     */
    closeOnClickOutside?: boolean;
}

/**
 * Function to show a dialog.
 */
export type ShowDialogFn = (info: DialogInfo | CloseWrapper<DialogInfo>, options?: DialogOptions) => void;

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
