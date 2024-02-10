import { UserSchedule } from '@shared/types/UserSchedule';
import clsx from 'clsx';
import React from 'react';
import userScheduleHandler from 'src/pages/background/handler/userScheduleHandler';
import DropdownArrowDown from '~icons/material-symbols/arrow-drop-down';
import DropdownArrowUp from '~icons/material-symbols/arrow-drop-up';
import DropdownDrag from '~icons/material-symbols/drag-indicator';
import Text from '../Text/Text';

export type Props = {
    style?: React.CSSProperties;
    testId?: string;
    beginningState?: boolean;
    // Dummy value solely for storybook
    dummySchedules?: UserSchedule[];
    dummyActiveIndex?: number;
    dummyActiveSchedule?: UserSchedule;
};

/**
 * This is a reusable dropdown component that can be used to toggle the visiblity of information
 */
export default function Dropdown(props: Props) {
    // Expand/Hide state for dropdown
    let [expanded, toggle] = React.useState(props.beginningState);
    let [activeScheduleIndex, select] = React.useState(props.dummyActiveIndex);
    let [activeSchedule, selectFrom] = React.useState(props.dummyActiveSchedule);
    const schedules = props.dummySchedules;
    if (schedules == null) {
        // if no dummy values passed in
        // useSchedules hook here
    }

    const toggleSwitch = () => {
        toggle(!expanded);
    };

    const switchSchedule = (index: number) => {
        const scheduleToSwitchTo = schedules[index];

        select(index);
        selectFrom(scheduleToSwitchTo);
        if (scheduleToSwitchTo != null && scheduleToSwitchTo.name != null) {
            userScheduleHandler.switchSchedule({
                data: {
                    scheduleName: scheduleToSwitchTo.name,
                },
                sender: null,
                sendResponse: null,
            });
        }
    };

    return (
        <div
            style={{ ...props.style, height: expanded && schedules ? `${40 * schedules.length + 54}px` : '64px' }}
            data-testid={props.testId}
            className='w-[290px] items-center gap-2 border border-ut-offwhite rounded border-solid p-[10px] py-[px] transition-height duration-300 ease-in-out'
        >
            <button className='flex border-none bg-white' onClick={toggleSwitch}>
                <div className='flex flex-wrap gap-x-[10px]'>
                    <Text variant='h4' className='w-100% text-left text-ut-burntorange'>
                        MAIN SCHEDULE:
                    </Text>
                    <Text variant='h3' className='text-theme-black'>
                        {activeSchedule ? activeSchedule.hours : 0} HOURS
                    </Text>
                    <Text variant='h4' className='m-t-auto text-ut-black'>
                        {activeSchedule ? activeSchedule.courses.length : 0} Courses
                    </Text>
                </div>
                <Text className='m-t-1 items-center items-center text-2xl text-ut-burntorange font-normal'>
                    {expanded ? <DropdownArrowDown /> : <DropdownArrowUp />}
                </Text>
            </button>
            {expanded ? (
                <ul className='m0 flex flex-col list-none self-stretch gap-[10px] px-0 py-1'>
                    {schedules.map((schedule, index) => (
                        <li
                            onClick={() => switchSchedule(index)}
                            className='w-100% flex items-center self-stretch justify-left text-ut-burntorange'
                        >
                            <div className='flex items-center justify-center gap-[7px]'>
                                <Text className='m-r-[-5.5px] m-t-1 self-center text-lg color-ut-gray'>
                                    <DropdownDrag />
                                </Text>
                                <div>
                                    <div className='h-[19px] w-[19px] inline-flex items-center justify-center gap-[7px] border-[2.5px] border-ut-burntorange rounded-full border-solid'>
                                        <div
                                            className={clsx(
                                                'bg-ut-burntorange h-2.5 w-2.5 rounded-full transform transition ease-out-expo duration-250',
                                                {
                                                    'scale-0 opacity-0 ease-in-out! duration-200!':
                                                        index !== activeScheduleIndex,
                                                }
                                            )}
                                        />
                                    </div>
                                </div>
                                <Text variant='p'>{schedule.name}</Text>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
