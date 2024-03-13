import type { DraggableProvided, DraggableProvidedDragHandleProps, OnDragEndResponder } from '@hello-pangea/dnd';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import type { ReactElement } from 'react';
import React, { useCallback, useEffect, useState } from 'react';

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
    equalityCheck?: (a: T, b: T) => boolean;
    gap?: number; // Impacts the spacing between items in the list
}

function wrap<T>(draggableElements: T[]) {
    return draggableElements.map((element, index) => ({
        id: `id:${index}`,
        content: element,
    }));
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const listCopy = [...list];

    const [removed] = listCopy.splice(startIndex, 1);
    listCopy.splice(endIndex, 0, removed);
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
function List<T>(props: ListProps<T>): JSX.Element {
    const [items, setItems] = useState(wrap(props.draggables));

    const equalityCheck = props.equalityCheck || ((a, b) => a === b);
    const transformFunction = props.children;

    useEffect(() => {
        // check if the draggables content has *actually* changed
        if (props.draggables.every((element, index) => equalityCheck(element, items[index].content))) {
            console.log("List's draggables have not changed");
            return;
        }

        console.log("List's draggables have changed, updating...");

        setItems(wrap(props.draggables));
    }, [props.draggables]);

    const onDragEnd: OnDragEndResponder = useCallback(
        result => {
            if (!result.destination) return;
            if (result.source.index === result.destination.index) return;

            // will reorder in place
            const reordered = reorder(items, result.source.index, result.destination.index);

            setItems(reordered);
            props.onReordered(reordered.map(item => item.content));
        },
        [items]
    );

    return (
        <div style={{ overflow: 'hidden' }}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    droppableId='droppable'
                    direction='vertical'
                    renderClone={(provided, snapshot, rubric) => {
                        let { style } = provided.draggableProps;
                        const transform = style?.transform;

                        if (snapshot.isDragging && transform) {
                            let [, , y] = transform.match(/translate\(([-\d]+)px, ([-\d]+)px\)/) || [];

                            style.transform = `translate3d(0px, ${y}px, 0px)`; // Apply constrained y value
                        }

                        return (
                            <Item
                                provided={provided}
                                isDragging={snapshot.isDragging}
                                item={items[rubric.source.index]}
                                style={{
                                    ...style,
                                }}
                            >
                                {transformFunction(items[rubric.source.index].content, provided.dragHandleProps)}
                            </Item>
                        );
                    }}
                >
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ marginBottom: `-${props.gap}px` }}
                        >
                            {items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {draggableProvided => (
                                        <div
                                            ref={draggableProvided.innerRef}
                                            {...draggableProvided.draggableProps}
                                            style={{
                                                ...draggableProvided.draggableProps.style,
                                                // if last item, don't add margin
                                                marginBottom: `${props.gap}px`,
                                            }}
                                        >
                                            {transformFunction(item.content, draggableProvided.dragHandleProps)}
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
