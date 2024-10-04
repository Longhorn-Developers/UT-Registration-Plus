import React from 'react';
import { Button } from './Button';

interface DialogButtonsProps {
    onClose: () => void;
    onDelete: () => void;
}

export const ConfirmDeleteButtons: React.FC<DialogButtonsProps> = ({ onClose, onDelete }) => (
    <>
        <Button variant='filled' color='ut-black' onClick={onClose}>
            Cancel
        </Button>
        <Button variant='filled' color='ut-red' onClick={onDelete}>
            Delete
        </Button>
    </>
);
