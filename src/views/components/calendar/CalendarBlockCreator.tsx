import { Popover, PopoverButton } from '@headlessui/react';
import type { Day } from '@shared/types/CourseMeeting';
import type { CustomBlockDraft } from '@shared/types/CustomBlock';
import type { PointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import CustomBlockPopover from './CustomBlockPopover';
import { DEFAULT_BLOCK, formatBlockTime, minuteAtPosition } from './customBlockUtils';

interface Props {
    day: Day;
    dayIndex: number;
    start: number;
    end: number;
    onCreate: (draft: CustomBlockDraft) => void | Promise<void>;
}

export default function CalendarBlockCreator(props: Props) {
    return (
        <Popover className='relative min-h-0 min-w-0' style={{ gridColumn: props.dayIndex + 3, gridRow: '3 / -1' }}>
            {({ open, close }) => <DragSelection {...props} open={open} close={close} />}
        </Popover>
    );
}

function DragSelection({ day, start, end, onCreate, open, close }: Props & { open: boolean; close: () => void }) {
    const dragStart = useRef<number | null>(null);
    const button = useRef<HTMLButtonElement>(null);
    const [selection, setSelection] = useState<{ startTime: number; endTime: number } | null>(null);
    useEffect(() => {
        if (!open) setSelection(null);
    }, [open]);

    const minuteAt = (event: PointerEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        return minuteAtPosition(event.clientY - rect.top, rect.height, start, end);
    };
    const updateSelection = (event: PointerEvent<HTMLDivElement>) => {
        const initial = dragStart.current;
        if (initial === null) return;
        const minute = minuteAt(event);
        const startTime = Math.min(initial, minute);
        const endTime = Math.max(initial, minute);
        setSelection(previous => {
            if (startTime === endTime) return null;
            if (previous?.startTime === startTime && previous.endTime === endTime) return previous;
            return { startTime, endTime };
        });
    };
    return (
        <div
            className='relative h-full'
            onPointerDown={event => {
                if (open || event.button !== 0 || event.pointerType === 'touch' || event.target !== event.currentTarget)
                    return;
                event.preventDefault();
                dragStart.current = minuteAt(event);
                event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={updateSelection}
            onPointerUp={event => {
                if (dragStart.current === null) return;
                updateSelection(event);
                dragStart.current = null;
                event.currentTarget.releasePointerCapture(event.pointerId);
                requestAnimationFrame(() => button.current?.click());
            }}
            onPointerCancel={() => {
                dragStart.current = null;
                setSelection(null);
            }}
        >
            {selection && (
                <>
                    <PopoverButton
                        ref={button}
                        tabIndex={-1}
                        aria-label={`Create block on ${day}, ${formatBlockTime(selection.startTime)} – ${formatBlockTime(selection.endTime)}`}
                        className='absolute box-border w-[calc(100%_-_8px)] rounded border-0 border-l-3 border-solid border-sky-500 bg-sky-500/15 pointer-events-none'
                        style={{
                            top: `${((selection.startTime - start) / (end - start)) * 100}%`,
                            height: `${((selection.endTime - selection.startTime) / (end - start)) * 100}%`,
                        }}
                    />
                    <CustomBlockPopover
                        initialDraft={{ ...DEFAULT_BLOCK, ...selection, days: [day] }}
                        onSave={onCreate}
                        onClose={close}
                    />
                </>
            )}
        </div>
    );
}
