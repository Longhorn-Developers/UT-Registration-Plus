import { PlusCircle } from '@phosphor-icons/react';
import React from 'react';

import { Button } from './Button';

/**
 * QuickAddModal component
 *
 * This component renders a button with a PlusCircle icon and the label "Quick Add".
 */
export default function QuickAddModal(): JSX.Element {
    return (
        <Button color='ut-black' size='small' variant='minimal' icon={PlusCircle}>
            Quick Add
        </Button>
    );
}
