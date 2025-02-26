import React from 'react';

import { Button } from '../common/Button';
import type { DayCode } from './types';
import { DAY_MAPPING } from './types';

interface DaySelectorProps {
    selectedDay: DayCode | null;
    onDaySelect: (day: DayCode) => void;
}

/**
 * DaySelector component allows users to select a day from a list of days.
 *
 * @param selectedDay - The currently selected day.
 * @param onDaySelect - Callback function to handle day selection.
 *
 * @returns The rendered DaySelector component.
 */
// const DaySelector = ({ selectedDay, onDaySelect }: DaySelectorProps): JSX.Element => (
export default function DaySelector({ selectedDay, onDaySelect }: DaySelectorProps): JSX.Element {
    return (
        <div className='flex gap-2 rounded-md bg-white/90 p-2 shadow-sm'>
            {(Object.keys(DAY_MAPPING) as DayCode[]).map(day => (
                <Button
                    key={day}
                    onClick={() => onDaySelect(day)}
                    color='ut-burntorange'
                    variant={selectedDay === day ? 'filled' : 'minimal'}
                    size='mini'
                    className='px-3 py-1'
                >
                    {day}
                </Button>
            ))}
        </div>
    );
}
