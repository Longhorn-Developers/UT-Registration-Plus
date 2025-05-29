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
export default function ScheduleDropdown({ defaultOpen, children }: ScheduleDropdownProps) {
    const [activeSchedule] = useSchedules();

    return (
        <div className='max-h-[200px] flex flex-col border border-ut-offwhite/50 rounded bg-white'>
            <Disclosure defaultOpen={defaultOpen}>
                {({ open }) => (
                    <>
                        <DisclosureButton className='w-full flex items-center border-none bg-transparent px-3.5 py-2.5 text-left'>
                            <div className='min-w-0 flex-1 overflow-hidden'>
                                <Text
                                    as='div'
                                    variant='h3'
                                    className='w-full truncate whitespace-nowrap text-ut-burntorange normal-case!'
                                >
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
                            className='flex flex-1 flex-col overflow-y-hidden'
                            enter='transition-[max-height,opacity,padding] duration-300 ease-in-out-expo'
                            enterFrom='max-h-0 opacity-0 p-0.5'
                            enterTo='max-h-[200px] opacity-100 p-0'
                            leave='transition-[max-height,opacity,padding] duration-300 ease-in-out-expo'
                            leaveFrom='max-h-[200px] opacity-100 p-0'
                            leaveTo='max-h-0 opacity-0 p-0.5'
                        >
                            <DisclosurePanel className='mx-1.75 mb-2.5 mt-2 flex flex-1 flex-col overflow-y-auto'>
                                <div className='mx-1.75'>{children}</div>
                            </DisclosurePanel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        </div>
    );
}
