import type { ReactNode } from 'react';
import React, { createContext } from 'react';

import { type ColorPickerInterface, useColorPicker } from '../hooks/useColorPicker';

const defaultContext: ColorPickerInterface = {
    selectedColor: null,
    setSelectedColor: () => {},
    handleCloseColorPicker: () => {},
    setSelectedCourse: () => {},
    isSelectedCourse: () => false,
    isSelectedBlock: () => false,
};

const ColorPickerContext = createContext<ColorPickerInterface>(defaultContext);

interface ColorPickerProviderProps {
    children: ReactNode;
}

/**
 * Provides the color picker context to its children.
 *
 * @param props - The properties for the ColorPickerProvider component.
 * @param children - The child components that will have access to the color picker context.
 * @returns The provider component that supplies the color picker context to its children.
 */
export const ColorPickerProvider = ({ children }: ColorPickerProviderProps) => {
    const colorPicker = useColorPicker();

    return <ColorPickerContext.Provider value={colorPicker}>{children}</ColorPickerContext.Provider>;
};

/**
 * Custom hook to use the ColorPicker context.
 * Throws an error if used outside of a ColorPickerProvider.
 * @returns The color picker context value.
 */
export const useColorPickerContext = () => {
    const context = React.useContext(ColorPickerContext);
    if (context === undefined) {
        throw new Error('useColorPickerContext must be used within a ColorPickerProvider');
    }
    return context;
};
