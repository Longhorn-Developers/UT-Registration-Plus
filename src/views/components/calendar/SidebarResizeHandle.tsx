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
    // The sidebar's left edge when the drag started, so moves don't have to measure it
    const sidebarLeft = useRef(0);
    // The last drag passed to onDrag. While dragging, the sidebar keeps its width and only a line follows the pointer,
    // so the calendar beside it isn't laid out again on every move. React only hears about the drag when it collapses
    // or reopens the sidebar
    const reported = useRef<SidebarDrag | null>(null);
    // The line showing where the edge will go, moved with a transform so it costs no layout
    const guide = useRef<HTMLDivElement>(null);

    const showGuide = (x: number | null) => {
        if (!guide.current) return;
        guide.current.style.visibility = x === null ? 'hidden' : 'visible';
        if (x !== null) guide.current.style.transform = `translateX(${x - 1}px)`;
    };

    const endDrag = (isCancelled: boolean) => {
        if (!drag.current) return;
        const ended = drag.current;
        drag.current = null;
        reported.current = null;
        showGuide(null);
        document.body.style.removeProperty('cursor');
        const sidebar = sidebarRef.current;
        if (!isCancelled && !ended.collapsed && sidebar) {
            // Jump straight to where the line was, rather than easing there
            sidebar.style.transition = 'none';
            sidebar.style.maxWidth = `${ended.width}px`;
            requestAnimationFrame(() => sidebar.style.removeProperty('transition'));
        }
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
                reported.current = drag.current;
                const rect = sidebarRef.current?.getBoundingClientRect();
                grabOffset.current = (rect?.right ?? event.clientX) - event.clientX;
                sidebarLeft.current = rect?.left ?? 0;
                document.body.style.cursor = 'col-resize';
            }}
            onPointerMove={event => {
                const sidebar = sidebarRef.current;
                if (!drag.current || !sidebar) return;
                const next = getDraggedSidebarWidth(event.clientX + grabOffset.current, sidebarLeft.current);
                drag.current = next;
                if (reported.current?.collapsed !== next.collapsed) {
                    reported.current = next;
                    onDrag(next);
                }
                showGuide(next.collapsed ? null : sidebarLeft.current + next.width);
                if (!next.collapsed) event.currentTarget.setAttribute('aria-valuenow', String(next.width));
            }}
            onPointerUp={() => endDrag(false)}
            onPointerCancel={() => endDrag(true)}
            onLostPointerCapture={() => endDrag(false)}
            onKeyDown={handleKeyDown}
            onDoubleClick={() => onResize(SIDEBAR_DEFAULT_WIDTH)}
        >
            <div className='h-full w-0.5 transition-colors group-hover:bg-ut-burntorange/50 group-focus-visible:bg-ut-burntorange group-active:bg-ut-burntorange' />
            <div
                ref={guide}
                aria-hidden
                className='pointer-events-none fixed inset-y-0 left-0 z-50 w-0.5 bg-ut-burntorange will-change-transform'
                style={{ visibility: 'hidden' }}
            />
        </div>
    );
}
