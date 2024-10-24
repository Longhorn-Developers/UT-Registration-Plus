import type { Course } from '@shared/types/Course';
import React from 'react';

type ScheduleEntry = {
    courseName: string;
    time: string;
    color: string;
};

type DaySchedule = {
    day: string;
    classes: ScheduleEntry[];
};

type WeekScheduleProps = {
    schedule: Record<string, string[]>;
    selectedDay: string | null;
    courses: Course[];
};

export const WeekSchedule = ({ schedule, selectedDay, courses }: WeekScheduleProps) => {
    const getClassColor = (courseName: string): string => {
        const course = courses.find(c => courseName.includes(`${c.department} ${c.number}`));
        return course?.colors?.primaryColor || '#BF5700';
    };

    const renderClassesWithBrackets = (classes: string[]) =>
        classes.map((className, index) => (
            <span key={className} className='flex items-center'>
                {index > 0 && (
                    <span className='mx-2 text-lg font-bold' style={{ color: getClassColor(classes[index - 1] ?? '') }}>
                        ]
                    </span>
                )}
                <span>{className}</span>
                {index < classes.length - 1 && (
                    <span className='mx-2 text-lg font-bold' style={{ color: getClassColor(className) }}>
                        [
                    </span>
                )}
            </span>
        ));

    return (
        <div className='w-96'>
            <div>
                <p className='text-lg font-medium'>Week Schedule</p>
            </div>
            <div className='space-y-4'>
                {Object.entries(schedule).map(([day, classes]) => (
                    <div key={day} className={`${selectedDay === day ? 'bg-ut-burntorange/10 rounded-md p-2' : ''}`}>
                        <h3 className='mb-2 font-medium'>{day}</h3>
                        <div className='flex flex-col gap-1 text-sm'>{renderClassesWithBrackets(classes)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
