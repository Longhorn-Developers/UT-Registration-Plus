import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { Button } from '@views/components/common/Button/Button';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import { toPng } from 'html-to-image';
import React from 'react';

import CalendarMonthIcon from '~icons/material-symbols/calendar-month';
import ImageIcon from '~icons/material-symbols/image';
import Divider from '../../common/Divider/Divider';

import type { CalendarCourseCellProps } from '../CalendarCourseCell/CalendarCourseCell';
import CalendarCourseBlock from '../CalendarCourseCell/CalendarCourseCell';

const CAL_MAP = {
    Sunday: 'SU',
    Monday: 'MO',
    Tuesday: 'TU',
    Wednesday: 'WE',
    Thursday: 'TH',
    Friday: 'FR',
    Saturday: 'SA',
};

type CalendarBottomBarProps = {
    courses?: CalendarCourseCellProps[];
    calendarRef: React.RefObject<HTMLDivElement>;
};

async function getSchedule() {
    const schedules = await UserScheduleStore.get('schedules');
    const activeIndex = await UserScheduleStore.get('activeIndex');
    const schedule = schedules[activeIndex];
    return schedule;
}

/**
 *
 */
export const CalendarBottomBar = ({ courses, calendarRef }: CalendarBottomBarProps): JSX.Element => {
    const saveAsPng = () => {
        if (calendarRef.current) {
            toPng(calendarRef.current, { cacheBust: true })
                .then(dataUrl => {
                    const link = document.createElement('a');
                    link.download = 'my-calendar.png';
                    link.href = dataUrl;
                    link.click();
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    function formatToHHMMSS(minutes) {
        const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
        const mins = String(minutes % 60).padStart(2, '0');
        return `${hours}${mins}00`;
    }

    function downloadICS(data) {
        const blob = new Blob([data], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'schedule.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const saveAsCal = async () => {
        const schedule = await getSchedule(); // Assumes this fetches the current active schedule

        let icsString = 'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nX-WR-CALNAME:My Schedule\n';

        schedule.courses.forEach(course => {
            course.schedule.meetings.forEach(meeting => {
                const { startTime, endTime, days, location } = meeting;

                // Format start and end times to HHMMSS
                const formattedStartTime = formatToHHMMSS(startTime);
                const formattedEndTime = formatToHHMMSS(endTime);

                // Map days to ICS compatible format
                console.log(days);
                const icsDays = days.map(day => CAL_MAP[day]).join(',');
                console.log(icsDays);

                // Assuming course has date started and ended, adapt as necessary
                const year = new Date().getFullYear(); // Example year, adapt accordingly
                // Example event date, adapt startDate according to your needs
                const startDate = `20240101T${formattedStartTime}`;
                const endDate = `20240101T${formattedEndTime}`;

                icsString += `BEGIN:VEVENT\n`;
                icsString += `DTSTART:${startDate}\n`;
                icsString += `DTEND:${endDate}\n`;
                icsString += `RRULE:FREQ=WEEKLY;BYDAY=${icsDays}\n`;
                icsString += `SUMMARY:${course.fullName}\n`;
                icsString += `LOCATION:${location.building} ${location.room}\n`;
                icsString += `END:VEVENT\n`;
            });
        });

        icsString += 'END:VCALENDAR';

        downloadICS(icsString);
    };

    if (courses?.length === -1) console.log('foo'); // dumb line to make eslint happy
    return (
        <div className='w-full flex py-1.25'>
            <div className='flex flex-grow items-center gap-3.75 pl-7.5 pr-2.5'>
                <Text variant='h4'>Async. and Other:</Text>
                <div className='h-14 inline-flex gap-2.5'>
                    {courses?.map(course => (
                        <CalendarCourseBlock
                            courseDeptAndInstr={course.courseDeptAndInstr}
                            status={course.status}
                            colors={course.colors}
                            key={course.courseDeptAndInstr}
                            className={clsx(course.className, 'w-35!')}
                        />
                    ))}
                </div>
            </div>
            <div className='flex items-center pl-2.5 pr-7.5'>
                <Divider orientation='vertical' size='1rem' className='mx-1.25' />
                <Button variant='single' color='ut-black' icon={CalendarMonthIcon} onClick={saveAsCal}>
                    Save as .CAL
                </Button>
                <Divider orientation='vertical' size='1rem' className='mx-1.25' />
                <Button variant='single' color='ut-black' icon={ImageIcon} onClick={saveAsPng}>
                    Save as .PNG
                </Button>
            </div>
        </div>
    );
};
