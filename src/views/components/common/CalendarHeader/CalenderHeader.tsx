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
    <div className='min-h-79px min-w-672px flex px-0 py-15'>
        <div className='flex flex-row gap-20'>
            <div className='flex gap-10'>
                <div className='flex gap-1'>
                    <Button variant='single' icon={MenuIcon} color='ut-gray' />
                    <div className='flex items-center'>
                        <LogoIcon style={{ marginRight: '5px' }} />
                        <div className='flex flex-col gap-1 whitespace-nowrap'>
                            <Text className='leading-trim text-cap font-roboto text-base font-medium'>
                                UT Registration
                            </Text>
                            <Text className='leading-trim text-cap font-roboto text-base font-medium'>Plus</Text>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <ScheduleTotalHoursAndCourses scheduleName='SCHEDULE' totalHours={22} totalCourses={8} />
                    DATA UPDATED ON: 12:00 AM 02/01/2024
                </div>
            </div>
            <div className='flex flex-row items-center space-x-8'>
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
