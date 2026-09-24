import type { DropAnimation } from '@dnd-kit/core';
import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import type { PropsWithChildren } from 'react';

const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                visibility: 'hidden',
            },
        },
    }),
};

/**
 * @returns Renders a visibly hidden sortable item in the sortable list while it is being dragged
 */
export function SortableItemOverlay({ children }: PropsWithChildren) {
    return <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>;
}
