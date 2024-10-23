import type {
    DraggableProvided,
    DraggableProvidedDragHandleProps,
    OnDragEndResponder,
    OnDragStartResponder,
} from '@hello-pangea/dnd';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import type { ReactElement, RefObject } from 'react';
import React, { useCallback, useEffect, useState } from 'react';

import ExtensionRoot from './ExtensionRoot/ExtensionRoot';

/*
 * Ctrl + f dragHandleProps on PopupCourseBlock.tsx for example implementation of drag handle (two lines of code)
 */

/**
 * Props for the List component.
 */
export interface ListProps<T> {
    draggables: T[];
    children: (draggable: T, handleProps: DraggableProvidedDragHandleProps) => ReactElement;
    onReordered: (elements: T[]) => void;
    itemKey: (item: T) => React.Key;
    gap?: number; // Impacts the spacing between items in the list
    boundingRef?: RefObject<HTMLElement>; // Element that clamps the y-value for draggable items
}

function wrap<T>(draggableElements: T[], keyTransform: ListProps<T>['itemKey']) {
    return draggableElements.map(element => ({
        id: keyTransform(element),
        content: element,
    }));
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const listCopy = [...list];

    const [removed] = listCopy.splice(startIndex, 1);
    if (removed) {
        listCopy.splice(endIndex, 0, removed);
    }

    return listCopy;
}

function getStyle(provided: DraggableProvided, style: React.CSSProperties) {
    const combined = {
        ...style,
        ...provided.draggableProps.style,
    };

    return combined;
}

function Item<T>(props: {
    provided: DraggableProvided;
    style: React.CSSProperties;
    item: T;
    isDragging: boolean;
    children: React.ReactElement;
}) {
    return (
        <div
            {...props.provided.draggableProps}
            ref={props.provided.innerRef}
            style={getStyle(props.provided, props.style)}
            className={props.isDragging ? 'is-dragging' : ''}
        >
            {props.children}
        </div>
    );
}

/**
 * `List` is a functional component that displays a course meeting.
 *
 * @example
 * <List draggableElements={elements} />
 */
function List<T>({ draggables, itemKey, children, onReordered, gap, boundingRef }: ListProps<T>): JSX.Element {
    const [items, setItems] = useState(wrap(draggables, itemKey));
    const [activeItem, setActiveItem] = useState<Element | null>(null);
    const boundingEl = boundingRef?.current;
    const transformFunction = children;

    useEffect(() => {
        setItems(wrap(draggables, itemKey));
        // This is on purpose
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draggables]);

    useEffect(() => {
        if (!activeItem || !boundingEl) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!boundingEl) return;

            const bounds = boundingEl.getBoundingClientRect();
            const isOutsideBounds = e.clientY < bounds.top || e.clientY > bounds.bottom;

            if (isOutsideBounds) {
                // force end of drag
                window.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'Escape',
                        keyCode: 27,
                        which: 27,
                        bubbles: true,
                    })
                );
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [activeItem, boundingEl]);

    const onDragEnd: OnDragEndResponder = useCallback(
        ({ destination, source }) => {
            setActiveItem(null);

            if (!destination) return;
            if (source.index === destination.index) return;

            // will reorder in place
            const reordered = reorder(items, source.index, destination.index);
            setItems(reordered);
            onReordered(reordered.map(item => item.content));
        },

        // This is on purpose
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [items]
    );

    const onDragStart: OnDragStartResponder = useCallback(() => {
        const el = document.querySelector('.is-dragging');
        setActiveItem(el);
    }, []);

    return (
        <div style={{ overflow: 'hidden' }}>
            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <Droppable
                    droppableId='droppable'
                    direction='vertical'
                    renderClone={(provided, snapshot, rubric) => {
                        const { style } = provided.draggableProps;
                        return (
                            <Item
                                provided={provided}
                                isDragging={snapshot.isDragging}
                                item={items[rubric.source.index]}
                                style={{
                                    ...style,
                                }}
                            >
                                <ExtensionRoot>
                                    {transformFunction(items[rubric.source.index]!.content, provided.dragHandleProps!)}
                                </ExtensionRoot>
                            </Item>
                        );
                    }}
                >
                    {provided => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ marginBottom: `-${gap}px` }}>
                            {items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                    {({ innerRef, draggableProps, dragHandleProps }) => (
                                        <div
                                            ref={innerRef}
                                            {...draggableProps}
                                            style={{
                                                ...draggableProps.style,
                                                marginBottom: `${gap}px`,
                                            }}
                                        >
                                            {
                                                transformFunction(
                                                    item.content,
                                                    dragHandleProps!
                                                ) /* always exists; only doesn't when "isDragDisabled" is set */
                                            }
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default React.memo(List) as typeof List;
