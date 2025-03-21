import type { ChangeEvent, ClipboardEvent } from 'react';
import { useCallback, useState } from 'react';

import type { DropdownOption } from '../components/common/Dropdown';

/**
 * useNumericInput
 *
 * A Custom hook to manage numeric input with length limit.
 * It stores and managed the value as a string.
 *
 * @param initialValue - The initial value of the input.
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

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        // Get pasted content
        const pastedText = e.clipboardData.getData('text');

        // Check if pasted content is numeric and within length limits
        if (/^\d*$/.test(pastedText)) {
            // Calculate what the new value would be
            const currentValue = e.currentTarget.value;
            const selectionStart = e.currentTarget.selectionStart || 0;
            const selectionEnd = e.currentTarget.selectionEnd || 0;

            const newValue =
                currentValue.substring(0, selectionStart) + pastedText + currentValue.substring(selectionEnd);

            // Only update if the new value is within length limit
            if (maxLength === undefined || newValue.length <= maxLength) {
                setValue(newValue);
                onChange?.(newValue);
            }
        }
    };

    return {
        value,
        handleChange,
        handlePaste,
        reset,
    };
};

/**
 * useQuickAddDropdowns
 *
 * A custom hook to manage the QuickAdd modal dropdowns.
 *
 * The hook takes the level 1 options only, and for each subsequent option, it calls the corresponding
 * getLevelOptions function to get its own options, based on the value of the prior level option. This
 * way, if the options are dynamically fetched, it can handle that.
 *
 * In the context of the QuickAdd modal, these levels represent:
 * - Level 1: The Field of Study (C.S., GOV., etc.)
 * - Level 2: Course Number (CS 439, GOV 312L, etc.)
 * - Level 3: Section Number (unique sections of this course)
 *
 * @param level1Options - The initial options for the first dropdown.
 * @param getLevel2Options - A function that takes the first option selected and returns the second level options.
 * @param getLevel3Options - A function that takes the second option selected and returns the third level options.
 * @param onChange - An optional callback function to be called when any of the options change.
 */
export const useQuickAddDropdowns = (
    level1Options: DropdownOption[],
    getLevel2Options: (selectedOption?: DropdownOption) => DropdownOption[],
    getLevel3Options: (selectedOption?: DropdownOption) => DropdownOption[],
    onChange?: () => void
) => {
    // Selected values for each level
    const [level1Selection, setLevel1Selection] = useState<DropdownOption | undefined>(undefined);
    const [level2Selection, setLevel2Selection] = useState<DropdownOption | undefined>(undefined);
    const [level3Selection, setLevel3Selection] = useState<DropdownOption | undefined>(undefined);

    // Available options for each level
    const [level2Options, setLevel2Options] = useState<DropdownOption[]>([]);
    const [level3Options, setLevel3Options] = useState<DropdownOption[]>([]);

    // Handle level 1 selection
    const handleLevel1Change = useCallback(
        (value: DropdownOption) => {
            if (value === level1Selection) {
                return;
            }

            setLevel1Selection(value);
            setLevel2Selection(undefined);
            setLevel3Selection(undefined);

            // Update level 2 options based on level 1 selection
            const newLevel2Options = value ? getLevel2Options(value) : [];
            setLevel2Options(newLevel2Options);
            setLevel3Options([]);

            onChange?.();
        },
        [getLevel2Options, level1Selection, onChange]
    );

    // Handle level 2 selection
    const handleLevel2Change = useCallback(
        (value: DropdownOption) => {
            if (value === level2Selection) {
                return;
            }

            setLevel2Selection(value);
            setLevel3Selection(undefined);

            // Update level 3 options based on level 2 selection
            const newLevel3Options = value ? getLevel3Options(value) : [];
            setLevel3Options(newLevel3Options);

            onChange?.();
        },
        [getLevel3Options, level2Selection, onChange]
    );

    // Handle level 3 selection
    const handleLevel3Change = useCallback(
        (value: DropdownOption) => {
            if (value === level3Selection) {
                return;
            }

            setLevel3Selection(value);

            onChange?.();
        },
        [level3Selection, onChange]
    );

    // Reset all selections and options
    const resetDropdowns = useCallback(() => {
        setLevel1Selection(undefined);
        setLevel2Selection(undefined);
        setLevel3Selection(undefined);
        setLevel2Options([]);
        setLevel3Options([]);

        onChange?.();
    }, [onChange]);

    return {
        selections: {
            level1: level1Selection,
            level2: level2Selection,
            level3: level3Selection,
        },

        options: {
            level1: level1Options,
            level2: level2Options,
            level3: level3Options,
        },

        disabled: {
            level1: false,
            level2: level1Selection === undefined,
            level3: level2Selection === undefined,
        },

        handleChange: {
            level1: handleLevel1Change,
            level2: handleLevel2Change,
            level3: handleLevel3Change,
        },

        resetDropdowns,
    };
};
