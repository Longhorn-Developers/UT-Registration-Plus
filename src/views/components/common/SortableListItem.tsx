import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableItemProvider } from '@views/contexts/SortableItemContext';
import type { CSSProperties, PropsWithChildren } from 'react';
import React, { useMemo } from 'react';

interface Props {
    id: UniqueIdentifier;
}

/**
 * @returns A wrapper around a sortable list item
 */
export function SortableListItem({ children, id }: PropsWithChildren<Props>) {
    const { attributes, isDragging, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
        id,
    });
    const context = useMemo(
        () => ({
            attributes,
            listeners,
            ref: setActivatorNodeRef,
        }),
        [attributes, listeners, setActivatorNodeRef]
    );

    const style: CSSProperties = {
        listStyle: 'none',
        backgroundColor: 'white',
        visibility: isDragging ? 'hidden' : 'visible',
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <SortableItemProvider value={context}>
            <li ref={setNodeRef} style={style}>
                {children}
            </li>
        </SortableItemProvider>
    );
}
