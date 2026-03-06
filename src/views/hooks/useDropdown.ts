import type { DropdownOption } from '@views/components/common/Dropdown';
import { useMemo, useState } from 'react';

/**
 * Generic hook that bridges the given objects to the Dropdown component.
 *
 * Manages the mapping between arbitrary items of type T and DropdownOption objects,
 * and tracks the selected item state.
 *
 */
export interface UseDropdownOptions<T> {
    /** The source items to populate the dropdown with. */
    items: T[];
    /** Extracts a unique string key from an item, used as the DropdownOption id. */
    getKey: (item: T) => string;
    /** Extracts the display label from an item. */
    getLabel: (item: T) => string;
}

/**
 * The return type of the useDropdown hook, containing the mapped dropdown options,
 * the currently selected option, and handlers to manage selection.
 *
 * The `selectedItem` is the actual given object corresponding to the selected dropdown option.
 * The `setSelectedItem` function allows programmatically setting the selection (e.g. for defaults).
 */
export interface UseDropdownReturn<T> {
    /** The DropdownOption array to pass to the Dropdown component's `options` prop. */
    dropdownOptions: DropdownOption[];
    /** The currently selected DropdownOption, or null if nothing is selected. */
    selectedOption: DropdownOption | null;
    /** Handler to pass to the Dropdown component's `onOptionChange` prop. */
    onOptionChange: (option: DropdownOption) => void;
    /** The currently selected underlying item, or undefined if nothing is selected. */
    selectedItem: T | undefined;
    /** Programmatically select an item (e.g. to set a default after async loading). */
    setSelectedItem: (item: T) => void;
}

/**
 * Generic hook that bridges given objects to the Dropdown component.
 *
 * Manages the mapping between arbitrary items of type T and DropdownOption objects,
 * and tracks the selected item state.
 *
 * @example
 * ```tsx
 * const semester = useDropdown({
 *     items: semesters,
 *     getKey: s => s.code,
 *     getLabel: s => `${s.season} ${s.year}`,
 * });
 *
 * <Dropdown
 *     selectedOption={semester.selectedOption}
 *     options={semester.dropdownOptions}
 *     onOptionChange={semester.onOptionChange}
 * />
 *
 * // Access the actual given object:
 * semester.selectedItem // Semester | undefined
 * ```
 */
export function useDropdown<T>({ items, getKey, getLabel }: UseDropdownOptions<T>): UseDropdownReturn<T> {
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    const itemsByKey = useMemo(() => new Map(items.map(item => [getKey(item), item])), [items, getKey]);

    const dropdownOptions: DropdownOption[] = useMemo(
        () => items.map(item => ({ id: getKey(item), label: getLabel(item) })),
        [items, getKey, getLabel]
    );

    const selectedItem = selectedKey !== null ? itemsByKey.get(selectedKey) : undefined;

    const selectedOption = useMemo(
        () => (selectedItem !== undefined ? { id: getKey(selectedItem), label: getLabel(selectedItem) } : null),
        [selectedItem, getKey, getLabel]
    );

    const onOptionChange = (option: DropdownOption) => {
        setSelectedKey(option.id);
    };

    const setSelectedItem = (item: T) => {
        setSelectedKey(getKey(item));
    };

    return {
        dropdownOptions,
        selectedOption,
        onOptionChange,
        selectedItem,
        setSelectedItem,
    };
}
