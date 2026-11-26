import { Transition } from '@headlessui/react';
import type { JSX, ReactNode } from 'react';

/**
 * Props for the Collapse component
 */
export interface CollapseProps {
    /** Whether the content is shown */
    show: boolean;
    className?: string;
    children: ReactNode;
}

/**
 * Opens and closes its content like the schedules' dropdown, easing its height and opacity together. The grid row grows
 * from 0fr to 1fr (the content's own height), and it's clipped only while it moves, so dropdowns in the content can
 * overflow it once it's open.
 */
export default function Collapse({ show, className, children }: CollapseProps): JSX.Element {
    return (
        <Transition show={show}>
            <div className='grid grid-rows-[1fr] motion-safe:(transition-[grid-template-rows,opacity] duration-300 ease-in-out-expo) data-[closed]:(grid-rows-[0fr] overflow-hidden opacity-0) data-[enter]:overflow-hidden data-[leave]:overflow-hidden'>
                {/* Bare, since a grid item's padding or border would keep it from closing all the way. Free to be
                    narrower than its content, too, so long text inside is cut short rather than widening the panel. */}
                <div className='min-h-0 min-w-0'>
                    <div className={className}>{children}</div>
                </div>
            </div>
        </Transition>
    );
}
