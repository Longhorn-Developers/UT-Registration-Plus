import {
    clampSidebarWidth,
    getDraggedSidebarWidth,
    SIDEBAR_DEFAULT_WIDTH,
    SIDEBAR_MAX_WIDTH,
    SIDEBAR_MIN_WIDTH,
} from '@views/lib/sidebarWidth';
import type React from 'react';
import { type RefObject, useRef } from 'react';

/** How far each arrow key press moves the sidebar's edge, in px */
const KEYBOARD_STEP = 16;

/**
 * What dragging the sidebar's edge has done so far: a new width, or collapsing the sidebar
 */
export type SidebarDrag = ReturnType<typeof getDraggedSidebarWidth>;

/**
 * Props for the SidebarResizeHandle component
 */
export interface SidebarResizeHandleProps {
    /** The sidebar the handle resizes, to measure from its left edge */
    sidebarRef: RefObject<HTMLElement | null>;
    /** The sidebar's current width, in px */
    width: number;
    /** Called as the edge is dragged, to show the new width (or the collapse) while dragging */
    onDrag: (drag: SidebarDrag) => void;
    /** Called once the drag ends, with where it ended, or null if it was cancelled */
    onDragEnd: (drag: SidebarDrag | null) => void;
    /** Called when the width is changed from the keyboard, or reset with a double click */
    onResize: (width: number) => void;
}

/**
 * The draggable right edge of the calendar sidebar, like the edges between VS Code's panels. Dragging it resizes the
 * sidebar within its limits, and dragging it most of the way left collapses the sidebar. It can also be focused and
 * moved with the arrow keys (Home and End for the limits), and a double click puts the sidebar back to its default
 * width.
 */
export default function SidebarResizeHandle({
    sidebarRef,
    width,
    onDrag,
    onDragEnd,
    onResize,
}: SidebarResizeHandleProps): React.JSX.Element {
    const drag = useRef<SidebarDrag | null>(null);
    // How far right of the pointer the sidebar's edge was when the drag started, so the edge doesn't jump to it
    const grabOffset = useRef(0);

    const endDrag = (isCancelled: boolean) => {
        if (!drag.current) return;
        const ended = drag.current;
        drag.current = null;
        document.body.style.removeProperty('cursor');
        onDragEnd(isCancelled ? null : ended);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const next = {
            ArrowLeft: width - KEYBOARD_STEP,
            ArrowRight: width + KEYBOARD_STEP,
            Home: SIDEBAR_MIN_WIDTH,
            End: SIDEBAR_MAX_WIDTH,
        }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        onResize(clampSidebarWidth(next));
    };

    return (
        // biome-ignore lint/a11y/useSemanticElements: an <hr> can't be focused or dragged; a focusable separator is how a resizable splitter is made accessible
        <div
            role='separator'
            aria-orientation='vertical'
            aria-label='Resize sidebar'
            aria-valuenow={width}
            aria-valuemin={SIDEBAR_MIN_WIDTH}
            aria-valuemax={SIDEBAR_MAX_WIDTH}
            tabIndex={0}
            title='Drag to resize, double-click to reset'
            className='group absolute inset-y-0 right-0 z-10 w-1.5 flex cursor-col-resize touch-none justify-end outline-none screenshot:hidden'
            onPointerDown={event => {
                if (event.button !== 0) return;
                // Stops the drag from selecting text, and keeps the pointer's events coming here while it's outside
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                drag.current = { collapsed: false, width };
                grabOffset.current =
                    (sidebarRef.current?.getBoundingClientRect().right ?? event.clientX) - event.clientX;
                document.body.style.cursor = 'col-resize';
            }}
            onPointerMove={event => {
                if (!drag.current || !sidebarRef.current) return;
                drag.current = getDraggedSidebarWidth(
                    event.clientX + grabOffset.current,
                    sidebarRef.current.getBoundingClientRect().left
                );
                onDrag(drag.current);
            }}
            onPointerUp={() => endDrag(false)}
            onPointerCancel={() => endDrag(true)}
            onLostPointerCapture={() => endDrag(false)}
            onKeyDown={handleKeyDown}
            onDoubleClick={() => onResize(SIDEBAR_DEFAULT_WIDTH)}
        >
            <div className='h-full w-0.5 transition-colors group-hover:bg-ut-burntorange/50 group-focus-visible:bg-ut-burntorange group-active:bg-ut-burntorange' />
        </div>
    );
}
