import type { ThemeColor } from '@shared/types/ThemeColors';
import React from 'react';

import { Button } from '../common/Button';
import type { DayCode } from './types';
import { DAY_MAPPING } from './types';

type DaySelectorProps = {
    selectedDay: DayCode | null;
    onDaySelect: (day: DayCode) => void;
};

/**
 * DaySelector component allows users to select a day from a predefined set of days.
 *
 * @param props - The properties object.
 * @param props.selectedDay - The currently selected day.
 * @param props.onDaySelect - Callback function to handle day selection.
 *
 * @returns The rendered DaySelector component.
 */
export const DaySelector = ({ selectedDay, onDaySelect }: DaySelectorProps) => (
    <div className='flex gap-2 rounded-md bg-white/90 p-2 shadow-sm'>
        {(Object.keys(DAY_MAPPING) as DayCode[]).map(day => {
            const color = (selectedDay === day ? 'ut-burntorange' : 'ut-white') as ThemeColor;
            return (
                <Button
                    key={day}
                    onClick={() => onDaySelect(day)}
                    variant={selectedDay === day ? 'filled' : 'outline'}
                    color={color}
                    className='rounded-sm'
                >
                    {day}
                </Button>
            );
        })}
    </div>
);
