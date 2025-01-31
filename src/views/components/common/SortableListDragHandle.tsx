import { useSortableItemContext } from '@views/contexts/SortableItemContext';
import type { CSSProperties } from 'react';
import React from 'react';

interface SortableListDragHandleProps {
    className?: string;
    style?: CSSProperties;
    children: React.ReactNode;
}

/**
 * @returns A wrapper component around sortable list item drag handles
 */
export function SortableListDragHandle({ className, style, children }: SortableListDragHandleProps) {
    const { attributes, listeners, ref } = useSortableItemContext();

    return (
        <div className={className} {...attributes} {...listeners} ref={ref} style={style}>
            {children}
        </div>
    );
}
