import type { HexColor } from '@shared/types/Color';
import type { ThemeColor } from '@shared/types/ThemeColors';
import { isValidHexColor } from '@shared/util/colors';
import { useCallback, useEffect, useState } from 'react';

import { updateCourseColors } from './useSchedules';

/**
 * Interface for the color picker functionality.
 */
export interface ColorPickerInterface {
    /**
     * The currently selected color.
     */
    selectedColor: ThemeColor | null;

    /**
     * Function to set the selected color.
     */
    setSelectedColor: React.Dispatch<React.SetStateAction<ThemeColor | null>>;

    /**
     * Function to close the color picker.
     */
    handleCloseColorPicker: () => void;

    /**
     * Function to set the selected course.
     *
     * @param courseID - The ID of the course.
     * @param dayIndex - The index of the day.
     * @param startIndex - The start index of the course.
     */
    setSelectedCourse: (courseID: number, dayIndex: number, startIndex: number) => void;

    /**
     * Function to check if a course is selected.
     *
     * @param courseID - The ID of the course.
     * @returns True if the course is selected, false otherwise.
     */
    isSelectedCourse: (courseID: number) => boolean;

    /**
     * Function to check if a course block is selected.
     *
     * @param courseID - The ID of the course.
     * @param dayIndex - The index of the day.
     * @param startIndex - The start index of the course.
     * @returns True if the block is selected, false otherwise.
     */
    isSelectedBlock: (courseID: number, dayIndex: number, startIndex: number) => boolean;
}

/**
 * Custom hook for managing color picker state and functionality.
 *
 * @returns The color picker interface with state and functions.
 */
export function useColorPicker(): ColorPickerInterface {
    const [selectedColor, setSelectedColor] = useState<ThemeColor | null>(null);
    const [selectedBlock, setSelectedBlock] = useState<{
        courseID: number | null;
        dayIndex: number | null;
        startIndex: number | null;
    }>({
        courseID: null,
        dayIndex: null,
        startIndex: null,
    });

    const updateSelectedCourseColor = useCallback(async () => {
        if (selectedBlock.courseID && selectedColor) {
            if (isValidHexColor(selectedColor as HexColor)) {
                await updateCourseColors(selectedBlock.courseID, `#${selectedColor.replace('#', '')}`);
            }
        }
    }, [selectedBlock.courseID, selectedColor]);

    const setSelectedCourse = (courseID: number, dayIndex: number, startIndex: number) => {
        setSelectedBlock({ courseID, dayIndex, startIndex });
    };

    const handleCloseColorPicker = () => {
        setSelectedColor(null);
        setSelectedBlock({ courseID: null, dayIndex: null, startIndex: null });
    };

    const isSelectedCourse = (courseID: number) => selectedBlock.courseID === courseID;
    const isSelectedBlock = (courseID: number, dayIndex: number, startIndex: number) =>
        selectedBlock.courseID === courseID &&
        selectedBlock.dayIndex === dayIndex &&
        selectedBlock.startIndex === startIndex;

    useEffect(() => {
        if (selectedBlock.courseID && selectedColor) {
            (async () => {
                await updateSelectedCourseColor();
            })();
        }
    }, [selectedBlock.courseID, selectedColor, updateSelectedCourseColor]);

    return {
        selectedColor,
        setSelectedColor,
        handleCloseColorPicker,
        setSelectedCourse,
        isSelectedBlock,
        isSelectedCourse,
    };
}
