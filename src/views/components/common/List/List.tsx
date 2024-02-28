import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import type { ReactElement } from 'react';
import React, { useCallback, useEffect,useState } from 'react';

/*
 * Ctrl + f dragHandleProps on PopupCourseBlock.tsx for example implementation of drag handle (two lines of code)
 *
 */

/**
 * Props for the List component.
 */
export interface ListProps {
    draggableElements: any[]; // Will later define draggableElements based on what types
    // of components are draggable.
    itemHeight: number;
    listHeight: number;
    listWidth: number;
    gap: number; // Impacts the spacing between items in the list
}

function initial(draggableElements: any[] = [], count: number) {
    return draggableElements.map((element, index) => ({
        id: `id:${index + count}`,
        content: element as ReactElement,
    }));
}

function reorder(list: { id: string; content: ReactElement }[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

function getStyle({ provided, style /*  , isDragging, gap   */ }) {
    const combined = {
        ...style,
        ...provided.draggableProps.style,
    };

    return combined;
}

function Item({ provided, item, style, isDragging /* , gap */ }) {
    return (
        <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            style={getStyle({ provided, style /* , isDragging, gap   */ })}
            className={`item ${isDragging ? 'is-dragging' : ''}`}
        >
            {React.cloneElement(item.content, { dragHandleProps: provided.dragHandleProps })}
        </div>
    );
}

interface RowProps {
    data: any; //   DraggableElements[]; Need to define DraggableElements interface once those components are ready
    index: number;
    style: React.CSSProperties;
}

const Row: React.FC<RowProps> = React.memo(({ data: { items, gap }, index, style }) => {
    const item = items[index];
    const adjustedStyle = {
        ...style,
        height: `calc(${style.height}px - ${gap}px)`, // Reduce the height by gap to accommodate the margin
        marginBottom: `${gap}px`, // Add gap as bottom margin
    };
    return (
        <Draggable draggableId={item.id} index={index} key={item.id}>
            {/* @ts-ignore  */}
            {provided => <Item provided={provided} item={item} style={adjustedStyle} gap={gap} />}
        </Draggable>
    );
});

/**
 * `List` is a functional component that displays a course meeting.
 *
 * @example
 * <List draggableElements={elements} />
 */
const List: React.FC<ListProps> = ({ draggableElements, itemHeight, listHeight, listWidth, gap = 12 }: ListProps) => {
    const [items, setItems] = useState(() => initial(draggableElements, 0));
    
    useEffect(() => {
        setItems((prevItems) => {
            const prevItemIds = prevItems.map(item => item.id);
            const newElements = draggableElements.filter((_, index) => !prevItemIds.includes(`id:${index}`));
            const newItems = initial(newElements, prevItems.length);
            return [...prevItems, ...newItems];
        });
    }, [draggableElements]);
    
    const onDragEnd = useCallback(
        result => {
            if (!result.destination) {
                return;
            }

            if (result.source.index === result.destination.index) {
                return;
            }

            const newItems = reorder(items, result.source.index, result.destination.index);

            setItems(newItems as { id: string; content: React.ReactElement }[]);
        },
        [items]
    );

    return (
        <div style={{ overflow: 'hidden', width: listWidth }}>
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
                                    style,
                                }}
                            />
                        );
                    }}
                >
                    {provided => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ width: `${listWidth}px`, marginBottom: `-${gap}px` }}
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
                                                marginBottom: `${gap}px`,
                                            }}
                                        >
                                            {React.cloneElement(item.content, {
                                                dragHandleProps: draggableProvided.dragHandleProps,
                                            })}
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
};

export default List;
