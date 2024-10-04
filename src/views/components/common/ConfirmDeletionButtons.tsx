import React from 'react';
import { Button } from './Button';

interface DialogButtonsProps {
    onClose: () => void;
    onDelete: () => void;
}

export function ConfirmDeleteButtons({ onClose, onDelete }: DialogButtonsProps): JSX.Element {
    return (
        <>
            <Button variant="filled" color="ut-black" onClick={onClose}>
                Cancel
            </Button>
            <Button variant="filled" color="ut-red" onClick={onDelete}>
                Delete
            </Button>
        </>
    );
}
