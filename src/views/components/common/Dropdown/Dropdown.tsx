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
            style={{ ...props.style, height: expanded && schedules ? `${40 * schedules.length + 54}px` : '72px' }}
            data-testid={props.testId}
            className='contain-paint items-center gap-2 border border-ut-offwhite rounded border-solid px-3.5 py-3 transition-height duration-300 ease-in-out'
        >
            <button className='mb-2 w-full flex items-center border-none bg-white text-left' onClick={toggleSwitch}>
                <div className='flex-1'>
                    <Text as='div' variant='h4' className='mb-1 w-100% text-ut-burntorange'>
                        MAIN SCHEDULE:
                    </Text>
                    <div>
                        <Text variant='h3' className='text-theme-black leading-[75%]!'>
                            {activeSchedule ? activeSchedule.hours : 0} HOURS
                        </Text>
                        <Text variant='h4' className='ml-2.5 text-ut-black leading-[75%]!'>
                            {activeSchedule ? activeSchedule.courses.length : 0} Courses
                        </Text>
                    </div>
                </div>
                <Text className='text-2xl text-ut-burntorange font-normal'>
                    {expanded ? <DropdownArrowDown /> : <DropdownArrowUp />}
                </Text>
            </button>

            <ul className='space-y-2'>
                {schedules.map((schedule, index) => (
                    <li
                        onClick={() => switchSchedule(index)}
                        className='w-100% flex cursor-pointer items-center self-stretch justify-left text-ut-burntorange'
                    >
                        <div className='group flex justify-center'>
                            <DropdownDrag className='h-6 w-6 cursor-move text-zinc-300 btn-transition -ml-1.5 hover:text-zinc-400' />
                            <div className='inline-flex items-center justify-center gap-1.5'>
                                <div className='h-5.5 w-5.5 flex items-center justify-center border-2px border-current rounded-full btn-transition group-active:scale-95'>
                                    <div
                                        className={clsx(
                                            'bg-current h-3 w-3 rounded-full transition tansform scale-100 ease-out-expo duration-250',
                                            {
                                                'scale-0! opacity-0 ease-in-out! duration-200!':
                                                    index !== activeScheduleIndex,
                                            }
                                        )}
                                    />
                                </div>
                                <Text variant='p'>{schedule.name}</Text>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
