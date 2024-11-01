import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';
import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';
import React from 'react';

import DropdownArrowDown from '~icons/material-symbols/arrow-drop-down';
import DropdownArrowUp from '~icons/material-symbols/arrow-drop-up';

/**
 * Props for the Dropdown component.
 */
export type ScheduleDropdownProps = {
    defaultOpen?: boolean;
    children: React.ReactNode;
};

/**
 * This is a reusable dropdown component that can be used to toggle the visiblity of information
 */
export default function ScheduleDropdown(props: ScheduleDropdownProps) {
    const [activeSchedule] = useSchedules();

    return (
        <div className='border border-ut-offwhite rounded border-solid bg-white'>
            <Disclosure defaultOpen={props.defaultOpen}>
                {({ open }) => (
                    <>
                        <DisclosureButton className='w-full flex items-center border-none bg-transparent px-3.5 py-2.5 text-left'>
                            <div className='flex-1'>
                                <Text as='div' variant='h3' className='mb-1 w-100% text-ut-burntorange'>
                                    {(activeSchedule ? activeSchedule.name : 'Schedule').toUpperCase()}:
                                </Text>
                                <p className='-mb-0.5'>
                                    <Text variant='h4' className='text-theme-black font-normal leading-[75%]!'>
                                        {activeSchedule ? activeSchedule.hours : 0}
                                    </Text>{' '}
                                    <span className='font-bold' style={{ fontVariant: 'all-small-caps' }}>
                                        {activeSchedule.hours === 1 ? 'Hour' : 'Hours'}
                                    </span>{' '}
                                    <Text variant='h4' className='text-theme-black font-normal leading-[75%]!'>
                                        {activeSchedule ? activeSchedule.courses.length : 0}
                                    </Text>{' '}
                                    <span className='font-bold' style={{ fontVariant: 'all-small-caps' }}>
                                        {activeSchedule.courses.length === 1 ? 'Course' : 'Courses'}
                                    </span>
                                </p>
                            </div>
                            <Text className='text-ut-burntorange text-2xl! font-normal!'>
                                {open ? <DropdownArrowDown /> : <DropdownArrowUp />}
                            </Text>
                        </DisclosureButton>

                        <Transition
                            as='div'
                            className='contain-paint max-h-55 origin-top overflow-auto transition-all duration-400 ease-in-out-expo'
                            enterFrom='transform scale-98 opacity-0 max-h-0!'
                            enterTo='transform scale-100 opacity-100 max-h-55'
                            leave='ease-out-expo'
                            leaveFrom='transform scale-100 opacity-100 max-h-55'
                            leaveTo='transform scale-98 opacity-0 max-h-0!'
                        >
                            <DisclosurePanel className='px-3.5 pb-2.5 pt-2'>{props.children}</DisclosurePanel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        </div>
    );
}
