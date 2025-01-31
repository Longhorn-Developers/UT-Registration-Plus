import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import type { ReactNode } from 'react';
import React, { createContext } from 'react';

interface Context {
    attributes: DraggableAttributes;
    listeners: DraggableSyntheticListeners;
    ref(node: HTMLElement | null): void;
}

export const SortableItemContext = createContext<Context | null>(null);

interface SortableItemProviderProps {
    value: Context;
    children: ReactNode;
}

/**
 * Provides the sortable item context to its children
 */
export const SortableItemProvider: React.FC<SortableItemProviderProps> = ({ value, children }) => (
    <SortableItemContext.Provider value={value}>{children}</SortableItemContext.Provider>
);

/**
 * @returns The sortable item context
 */
export const useSortableItemContext = () => {
    const context = React.useContext(SortableItemContext);
    if (!context) {
        throw new Error('useSortableItemContext must be used within a SortableItemContext.Provider');
    }
    return context;
};
