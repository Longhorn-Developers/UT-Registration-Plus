import { Disclosure, Transition } from '@headlessui/react';
import { UserSchedule } from '@shared/types/UserSchedule';
import React from 'react';
import userScheduleHandler from 'src/pages/background/handler/userScheduleHandler';
import DropdownArrowDown from '~icons/material-symbols/arrow-drop-down';
import DropdownArrowUp from '~icons/material-symbols/arrow-drop-up';
import List from '../List/List';
import Text from '../Text/Text';

export type Props = {
    style?: React.CSSProperties;
    // Dummy value solely for storybook
    dummySchedules?: UserSchedule[];
    dummyActiveIndex?: number;
    dummyActiveSchedule?: UserSchedule;
    scheduleComponents?: any[];
};

/**
 * This is a reusable dropdown component that can be used to toggle the visiblity of information
 */
export default function Dropdown(props: Props) {
    // Expand/Hide state for dropdown
    let [expanded, toggle] = React.useState(false);
    let [activeScheduleIndex, select] = React.useState(props.dummyActiveIndex);
    let [activeSchedule, selectFrom] = React.useState(props.dummyActiveSchedule);
    let [scheduleComponents, setScheduleComponents] = React.useState(props.scheduleComponents);

    const schedules = props.dummySchedules;
    if (schedules == null) {
        // if no dummy values passed in
        // useSchedules hook here
    }

    const toggleSwitch = () => {
        toggle(!expanded);
    };

    // WIP function to swap schedules. Prefer to use the hook when in production
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
            className='items-left absolute w-72 flex flex-col border'
        >
            <Disclosure>
                <Disclosure.Button>
                    <div className='flex items-center border-none bg-white p-3 text-left'>
                        <div className='flex-1'>
                            <Text as='div' variant='h4' className='text-ut-burntorange mb-1 w-100%'>
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
                        <Text className='text-ut-burntorange text-2xl font-normal'>
                            {expanded ? <DropdownArrowDown /> : <DropdownArrowUp />}
                        </Text>
                    </div>
                </Disclosure.Button>

                <Transition
                    enter='transition duration-100 ease-out'
                    enterFrom='transform scale-95 opacity-0'
                    enterTo='transform scale-100 opacity-100'
                    leave='transition duration-75 ease-out'
                    leaveFrom='transform scale-100 opacity-100'
                    leaveTo='transform scale-95 opacity-0'
                    beforeEnter={() => {
                        toggleSwitch();
                    }}
                    afterLeave={() => {
                        toggleSwitch();
                    }}
                >
                    <Disclosure.Panel>
                        <List
                            draggableElements={scheduleComponents}
                            itemHeight={30}
                            listHeight={30}
                            listWidth={240}
                            gap={10}
                        />
                    </Disclosure.Panel>
                </Transition>
            </Disclosure>
        </div>
    );
}
