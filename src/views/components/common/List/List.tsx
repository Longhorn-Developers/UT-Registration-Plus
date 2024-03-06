import React from 'react';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FixedSizeList, areEqual } from "react-window";


/**
 * Props for the List component. 
 */
export interface ListProps {
    draggableElements: any[]; //Will later define draggableElements based on what types 
                              //of components are draggable.
}

function initial(draggableElements: any[] = []) {
    return draggableElements.map((element, index) => ({
        id: `id:${index}`,
        content: element
    }));
}

function reorder(list, startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

function getStyle({ provided, style, isDragging }) {
    /*const combined = {
        ...style,
        ...provided.draggableProps.style
    };

    const marginBottom = 8;
    const withSpacing = {
        ...combined,
        height: isDragging ? combined.height : combined.height - marginBottom,
        marginBottom
    };
    return withSpacing;*/
    return style;
}

function Item({ provided, item, style, isDragging }) {
    return (
        <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={getStyle({ provided, style, isDragging })}
            className={`item ${isDragging ? "is-dragging" : ""}`}
        >
            {item.content}
        </div>
    );
}

interface RowProps  {
    data: any, //DraggableElements[]; Need to define DraggableElements interface once those components are ready
    index: number,
    style: any
}

const Row: React.FC<RowProps> = React.memo(({ data: items, index, style }) => {
    const item = items[index];
    return (
        <Draggable draggableId={item.id} index={index} key={item.id}>
        {/*@ts-ignore*/}
        {provided => <Item provided={provided} item={item} style={style} />}
        </Draggable>
    );
}, areEqual);

/**
 * `List` is a functional component that displays a course meeting.
 *
 * @example
 * <List draggableElements={elements} />
 */
const List: React.FC<ListProps> = ({
    draggableElements
}: ListProps) => {
    const [items, setItems] = useState(() => initial(draggableElements));

    function onDragEnd(result) {
        if (!result.destination) {
          return;
        }
        if (result.source.index === result.destination.index) {
          return;
        }
    
        const newItems = reorder(
          items,
          result.source.index,
          result.destination.index
        );
        setItems(newItems as {id: string, content: any}[]);
      }

    return (
        <DragDropContext onDragEnd = {onDragEnd}>
            <div style = {{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
             }}>
                <Droppable 
                    droppableId="droppable"
                    mode="virtual"
                    renderClone={(provided, snapshot, rubric) => (
                    <Item
                        provided={provided}
                        isDragging={snapshot.isDragging}
                        item={items[rubric.source.index]}
                        style = {{

                        }}
                    />
                    )}
                >
                    {provided => (
                        <FixedSizeList
                            height={500}
                            itemCount={items.length}
                            itemSize={80}
                            width={300}
                            outerRef={provided.innerRef}
                            itemData={items}
                        >
                            {Row}
                        </FixedSizeList>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};

export default List;
