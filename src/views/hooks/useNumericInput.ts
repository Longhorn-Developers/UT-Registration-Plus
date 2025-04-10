import { type ChangeEvent, useState } from 'react';

/**
 * useNumericInput
 *
 * A Custom hook to manage numeric input with length limit.
 * It stores and managed the value as a string.
 *
 * @param initialValue - The initial value of the input, an empty string by default.
 * @param maxLength - The maximum length of the input.
 * @param onChange - Optional callback function to be called when the value changes.
 * @returns An object containing the input value, a function to set the value, and event handlers for change and paste events.
 */
export const useNumericInput = (initialValue: string = '', maxLength?: number, onChange?: (value: string) => void) => {
    const [value, setValue] = useState<string>(initialValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // Only allow if the value consists of numbers and is within length limit
        if (/^\d*$/.test(newValue) && (maxLength === undefined || newValue.length <= maxLength)) {
            setValue(newValue);
            onChange?.(newValue);
        }
    };

    const reset = () => {
        setValue('');
        onChange?.('');
    };

    return {
        value,
        handleChange,
        reset,
    };
};
