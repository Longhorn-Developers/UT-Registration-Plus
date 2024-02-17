import React from 'react';
import { Status } from '@shared/types/Course';
import Divider from '../Divider/Divider';
import { Button } from '../Button/Button';
import Text from '../Text/Text';
import MenuIcon from '~icons/material-symbols/menu';
import LogoIcon from '~icons/material-symbols/add-circle-outline';
import UndoIcon from '~icons/material-symbols/undo';
import RedoIcon from '~icons/material-symbols/redo';
import SettingsIcon from '~icons/material-symbols/settings';
import ScheduleTotalHoursAndCourses from '../ScheduleTotalHoursAndCourses/ScheduleTotalHoursAndCourses';
import CourseStatus from '../CourseStatus/CourseStatus';

const CalendarHeader = () => (
    <div className='min-h-79px min-w-672px flex flex-wrap items-center px-0 py-15'>
        <div className="flex flex-row">
            <div className='flex gap-5'>
                <Button variant='single' icon={MenuIcon} color='ut-gray' />
                <div className='flex items-center'>
                    <LogoIcon style={{ marginRight: '5px' }} />
                    <Text>UT Registration Plus</Text>
                </div>
            </div>
            <div className='flex flex-col'>
                <ScheduleTotalHoursAndCourses scheduleName='SCHEDULE' totalHours={22} totalCourses={8} />
                DATA UPDATED ON: 12:00 AM 02/01/2024
            </div>
            <div className='flex flex-row'>
                <div className='flex flex-row space-x-4'>
                    <CourseStatus size='small' status={Status.WAITLISTED} />
                    <CourseStatus size='small' status={Status.CLOSED} />
                    <CourseStatus size='small' status={Status.CANCELLED} />
                </div>
                <div className='flex flex-row'>
                    <Button variant='single' icon={UndoIcon} color='ut-black' />
                    <Button variant='single' icon={RedoIcon} color='ut-black' />
                    <Button variant='single' icon={SettingsIcon} color='ut-black' />
                </div>
            </div>
        </div>
        <Divider type='solid' />
    </div>
);

export default CalendarHeader;
