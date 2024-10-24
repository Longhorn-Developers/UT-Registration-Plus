import type { ThemeColor } from '@shared/types/ThemeColors';
import React from 'react';

import { Button } from '../common/Button';

export type DayCode = 'M' | 'T' | 'W' | 'TTH' | 'F';
export type DayMapping = Record<DayCode, string>;

export const DAY_MAPPING: DayMapping = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    TTH: 'Thursday',
    F: 'Friday',
} as const;

type DaySelectorProps = {
    selectedDay: DayCode | null;
    onDaySelect: (day: DayCode) => void;
};

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
                    // className='h-2 w-2'
                >
                    {day}
                </Button>
            );
        })}
    </div>
);
