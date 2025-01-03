import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';
import React from 'react';

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
                                <Text as='div' variant='h3' className='w-100% text-ut-burntorange normal-case!'>
                                    {activeSchedule ? activeSchedule.name : 'Schedule'}
                                </Text>
                                <div className='flex gap-2.5 text-theme-black leading-[75%]!'>
                                    <div className='flex gap-1.25'>
                                        <Text variant='h4'>{activeSchedule ? activeSchedule.hours : 0}</Text>
                                        <Text variant='h4' className='font-all-small-caps!'>
                                            {activeSchedule.hours === 1 ? 'HOUR' : 'HOURS'}
                                        </Text>
                                    </div>
                                    <div className='flex gap-1.25'>
                                        <Text variant='h4'>{activeSchedule ? activeSchedule.courses.length : 0}</Text>
                                        <Text variant='h4' className='font-all-small-caps!'>
                                            {activeSchedule.courses.length === 1 ? 'COURSE' : 'COURSES'}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                            <Text className='text-ut-burntorange text-2xl! font-normal!'>
                                {open ? <CaretDown weight='fill' /> : <CaretUp weight='fill' />}
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
