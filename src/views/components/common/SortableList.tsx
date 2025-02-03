import type { Active, UniqueIdentifier } from '@dnd-kit/core';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableItemProvider } from '@views/contexts/SortableItemContext';
import { useCursor } from '@views/hooks/useCursor';
import clsx from 'clsx';
import type { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

import { SortableItemOverlay } from './SortableItemOverlay';

/**
 * Extendable Prop for Sortable Item Id
 */
export interface BaseItem {
    id: UniqueIdentifier;
}

/**
 * Props for the SortableList component.
 */
export interface SortableListProps<T extends BaseItem> {
    draggables: T[];
    /**
     *
     * @param items - Handles the behavior of the list when items change order
     */
    onChange(items: T[]): void;
    /**
     *
     * @param item - Renders a sortable item component
     */
    renderItem(item: T): ReactNode;
    className?: string; // Impacts the spacing between items in the list
}

/**
 * Props for the SortableListItem Component
 */
export interface SortableListItemProps {
    id: UniqueIdentifier;
}

function SortableListItem({ children, id }: PropsWithChildren<SortableListItemProps>) {
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

    const style = {
        listStyle: 'none',
        visibility: isDragging ? 'hidden' : 'visible',
        transform: CSS.Translate.toString(transform),
        transition,
    } satisfies CSSProperties;

    return (
        <SortableItemProvider value={context}>
            <li ref={setNodeRef} style={style}>
                {children}
            </li>
        </SortableItemProvider>
    );
}

/**
 * SortableList is a component that renders a drag-and-drop sortable list restricted by its parent
 */
export function SortableList<T extends BaseItem>({
    draggables,
    renderItem,
    onChange,
    className,
}: SortableListProps<T>): JSX.Element {
    const [active, setActive] = useState<Active | null>(null);
    const [items, setItems] = useState<T[]>(draggables);
    const { setCursorGrabbing } = useCursor();

    useEffect(() => {
        setItems(draggables);
    }, [draggables]);

    const activeItem = useMemo(() => items.find(item => item.id === active?.id), [active, items]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <div className={clsx('h-full w-full')}>
            <ul className={clsx('overflow-clip flex gap-spacing-3 flex-col', className)}>
                <DndContext
                    modifiers={[restrictToParentElement]}
                    sensors={sensors}
                    onDragStart={({ active }) => {
                        setCursorGrabbing(true);
                        setActive(active);
                    }}
                    onDragEnd={({ active, over }) => {
                        setCursorGrabbing(false);
                        if (over && active.id !== over.id) {
                            const activeIndex = items.findIndex(({ id }) => id === active.id);
                            const overIndex = items.findIndex(({ id }) => id === over.id);
                            const reorderedItems = arrayMove(items, activeIndex, overIndex);
                            onChange(reorderedItems);
                            setItems(reorderedItems);
                        }
                        setActive(null);
                    }}
                    onDragCancel={() => {
                        setCursorGrabbing(false);
                        setActive(null);
                    }}
                >
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {items.map(item => (
                            <SortableListItem key={item.id} id={item.id}>
                                {renderItem(item)}
                            </SortableListItem>
                        ))}
                    </SortableContext>
                    <SortableItemOverlay>
                        {activeItem ? (
                            <SortableListItem id={activeItem.id}>{renderItem(activeItem)}</SortableListItem>
                        ) : null}
                    </SortableItemOverlay>
                </DndContext>
            </ul>
        </div>
    );
}
