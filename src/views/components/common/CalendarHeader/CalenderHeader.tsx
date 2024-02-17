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
    <div className='min-h-79px min-w-672px flex flex-wrap items-center justify-between px-0 py-15'>
        <div className='flex'>
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
        <div className='flex flex-row items-center'>
            <CourseStatus size='small' status={Status.WAITLISTED} />
            <CourseStatus size='small' status={Status.CLOSED} />
            <CourseStatus size='small' status={Status.CANCELLED} />
        </div>
        <div className='flex'>
            <Button variant='outline' icon={UndoIcon} color='ut-black' />
            <Button variant='outline' icon={RedoIcon} color='ut-black' />
        </div>
        <Button variant='outline' icon={SettingsIcon} color='ut-black' />
        <Divider type='solid' />
    </div>
);

export default CalendarHeader;
