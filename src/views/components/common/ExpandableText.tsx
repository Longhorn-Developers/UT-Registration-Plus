import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import type { JSX, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

/**
 * Props for the ExpandableText component
 */
export interface ExpandableTextProps {
    children: ReactNode;
    /** How many lines to show before cutting the text off */
    lines?: 1 | 2;
    variant?: 'mini' | 'small' | 'p';
    className?: string;
}

/**
 * Text that's cut off after a number of lines, with a "More" button that expands it in place
 * (and a "Less" button to cut it off again). The button only shows when the text is actually cut off.
 */
export default function ExpandableText({
    children,
    lines = 2,
    variant = 'small',
    className,
}: ExpandableTextProps): JSX.Element {
    const ref = useRef<HTMLElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCutOff, setIsCutOff] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return undefined;

        const check = () =>
            setIsCutOff(
                element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1
            );
        check();

        const observer = new ResizeObserver(check);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <div className={clsx('min-w-0', { 'flex flex-row items-baseline gap-spacing-2': lines === 1 }, className)}>
            <Text
                ref={ref}
                variant={variant}
                // line-clamp sets its own display, so it can't be combined with block
                className={clsx('min-w-0', {
                    'block truncate': lines === 1 && !isExpanded,
                    'line-clamp-2': lines === 2 && !isExpanded,
                    block: isExpanded,
                })}
            >
                {children}
            </Text>
            {(isCutOff || isExpanded) && (
                <button
                    type='button'
                    className='flex-shrink-0 cursor-pointer border-none bg-transparent p-0 text-ut-burntorange hover:underline focusable'
                    onClick={() => setIsExpanded(expanded => !expanded)}
                    aria-expanded={isExpanded}
                >
                    <Text variant='mini' className='font-bold!'>
                        {isExpanded ? 'Less' : 'More'}
                    </Text>
                </button>
            )}
        </div>
    );
}
