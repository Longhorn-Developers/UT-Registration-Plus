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
    <div
        style={{
            display: 'flex',
            minWidth: '672px',
            minHeight: '79px',
            padding: '15px 0px',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignContent: 'center',
            rowGap: '10px',
            alignSelf: 'stretch',
            flexWrap: 'wrap',
        }}
    >
        <Button variant='single' icon={MenuIcon} color='ut-gray' />

        <div style={{ display: 'flex', alignItems: 'center' }}>
            <LogoIcon style={{ marginRight: '5px' }} />
            <Text>Your Logo Text</Text>
        </div>

        <ScheduleTotalHoursAndCourses scheduleName='SCHEDULE' totalHours={22} totalCourses={8} />

        <CourseStatus size='small' status={Status.WAITLISTED} />
        <CourseStatus size='small' status={Status.CLOSED} />
        <CourseStatus size='small' status={Status.CANCELLED} />

        <div style={{ display: 'flex' }}>
            <Button variant='outline' icon={UndoIcon} color='ut-black' />
            <Button variant='outline' icon={RedoIcon} color='ut-black' />
        </div>

        <Button variant='outline' icon={SettingsIcon} color='ut-black' />

        <Divider type='solid' />
    </div>
);

export default CalendarHeader;
