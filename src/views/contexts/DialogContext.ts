import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

/**
 * Close wrapper
 */
export type CloseWrapper<T> = (close: () => void) => T;

/**
 * Information about a dialog.
 */
export interface DialogInfo {
    title?: JSX.Element;
    description?: JSX.Element;
    buttons?: JSX.Element | CloseWrapper<JSX.Element>;
    showFocus?: boolean;
    onClose?: () => void;
}

/**
 * Function to show a dialog.
 */
export type ShowDialogFn = (info: DialogInfo | CloseWrapper<DialogInfo>) => void;

/**
 * Context for the dialog provider.
 */
export const DialogContext = createContext<ShowDialogFn>(() => {});

/**
 * @returns The dialog context for showing dialogs.
 */
export const useDialog = () => useContext(DialogContext);
