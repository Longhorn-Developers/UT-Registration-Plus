import React from 'react';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FixedSizeList, areEqual } from 'react-window';
import { ReactElement } from 'react';

/*Ctrl + f dragHandleProps on PopupCourseBlock.tsx for example implementation of drag handle (two lines of code)
 *
 */

/**
 * Props for the List component. 
 */
export interface ListProps {
    draggableElements: any[]; //Will later define draggableElements based on what types 
                              //of components are draggable.
    itemHeight: number; 
    listHeight: number;
    listWidth: number;
    gap: number; //Impacts the spacing between items in the list
                 
}

function initial(draggableElements: any[] = []) {
    return draggableElements.map((element, index) => ({
        id: `id:${index}`,
        content: element as ReactElement,
    }));
}

function reorder(list: { id: string, content: ReactElement }[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

function getStyle({ provided, style, isDragging, gap }) {
    const combined = {
        ...style,
        ...provided.draggableProps.style
    };
    
    return combined;
}

function Item({ provided, item, style, isDragging, gap }) {
    return (
        <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            style={getStyle({ provided, style, isDragging, gap })}
            className={`item ${isDragging ? "is-dragging" : ""}`}
        >
            {React.cloneElement(item.content, {dragHandleProps: provided.dragHandleProps})}
        </div>
    );
}

interface RowProps  {
    data: any, //DraggableElements[]; Need to define DraggableElements interface once those components are ready
    index: number,
    style: React.CSSProperties,
}

const Row: React.FC<RowProps> = React.memo(({ data: { items, gap }, index, style }) => {
    const item = items[index];
    const adjustedStyle = {
        ...style,
        height: `calc(${style.height}px - ${gap}px)`, // Reduce the height by gap to accommodate the margin
        marginBottom: `${gap}px` // Add gap as bottom margin
      };
    return (
        <Draggable draggableId={item.id} index={index} key={item.id}>
        {/*@ts-ignore*/}
        {provided => <Item provided={provided} item={item} style={adjustedStyle} gap={gap}/>}
        </Draggable>
    );
}, areEqual);

/**
 * `List` is a functional component that displays a course meeting.
 *
 * @example
 * <List draggableElements={elements} />
 */
const List: React.FC<ListProps> = ( { draggableElements, itemHeight, listHeight, listWidth, gap=8 }: ListProps) => {
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
        setItems(newItems as {id: string, content: ReactElement}[]);
      }

    return (
        <div style={{ overflow: 'hidden', width: listWidth, height: listHeight }}>
        <DragDropContext onDragEnd = {onDragEnd}>
            <div style = {{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
             }}>
                <Droppable 
                    droppableId="droppable"
                    mode="virtual"
                    direction="vertical"
                    renderClone={(provided, snapshot, rubric) => {
                    let { style } = provided.draggableProps;
                    const transform = style?.transform;
                
                    if (snapshot.isDragging && transform) {
                        let [x, y] = transform
                            .replace('translate(', '')
                            .replace(')', '')
                            .split(',')
                            .map((v) => parseInt(v, 10));
                        
                        const minTranslateY = -1 * rubric.source.index * itemHeight;
                        const maxTranslateY = (items.length - rubric.source.index - 1) * itemHeight;
                        if (y < minTranslateY) {
                            
                        }  
                        else if (y > maxTranslateY) {
                            
                        }
                        else {
                            
                        }

                        style.transform = `translate(0px, ${y}px)`; // Apply constrained y value  
                    }
                    
                    return (
                        <Item
                            provided={provided}
                            isDragging={snapshot.isDragging}
                            item={items[rubric.source.index]}
                            style = {{
                                style
                            }}
                            gap = {gap}
                        />
                    )}
                }
                >
                    {provided => (
                        <FixedSizeList
                            height={listHeight}
                            itemCount={items.length}
                            itemSize={itemHeight}
                            width={listWidth}
                            outerRef={provided.innerRef}
                            itemData={{ items, gap }}
                        >
                            {Row}
                        </FixedSizeList>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
        </div>
    );
};

export default List;