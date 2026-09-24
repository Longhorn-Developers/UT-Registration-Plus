import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';
import Text from '@views/components/common/Text/Text';
import { useActiveSchedule } from '@views/hooks/useSchedules';
import type React from 'react';
import CaretDownFillIcon from '~icons/ph/caret-down-fill';
import CaretUpFillIcon from '~icons/ph/caret-up-fill';

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
    const activeSchedule = useActiveSchedule();

    const totalHours = activeSchedule?.hours ?? 0;
    const totalCourses = activeSchedule?.courses.length ?? 0;

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
                                <Text variant='h4' as='p' className='mt-0.5 text-theme-black inline-flex gap-3'>
                                    <span>
                                        {totalHours}&nbsp;
                                        <span className='ml-0.5 uppercase'>{totalHours === 1 ? 'Hour' : 'Hours'}</span>
                                    </span>
                                    <span>
                                        {totalCourses}&nbsp;
                                        <span className='ml-0.5 uppercase'>
                                            {totalCourses === 1 ? 'Course' : 'Courses'}
                                        </span>
                                    </span>
                                </Text>
                            </div>
                            <Text className='text-ut-burntorange text-2xl! font-normal!'>
                                {open ? <CaretDownFillIcon /> : <CaretUpFillIcon />}
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
