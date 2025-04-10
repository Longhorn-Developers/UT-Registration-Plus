import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react';
import { addCourseByURL } from '@pages/background/lib/addCourseByURL';
import {
    Calendar,
    ChalkboardTeacher,
    GraduationCap,
    HashStraight,
    ListNumbers,
    Plus,
    PlusCircle,
} from '@phosphor-icons/react';
import type { CourseItem, SectionItem, SemesterItem } from '@shared/types/CourseData';
import { useNumericInput } from '@views/hooks/useNumericInput';
import { useQuickAddDropdowns } from '@views/hooks/useQuickAdd';
import useSchedules from '@views/hooks/useSchedules';
import { FetchStatus } from '@views/lib/getCoursesAndSections';
import type { StudyField } from '@views/resources/studyFields';
import clsx from 'clsx';
import React from 'react';

import { Button } from './Button';
import DialogProvider from './DialogProvider/DialogProvider';
import Divider from './Divider';
import type { DropdownOption } from './Dropdown';
import Dropdown from './Dropdown';
import { ExtensionRootWrapper } from './ExtensionRoot/ExtensionRoot';
import Input from './Input';
import Spinner from './Spinner';
import Text from './Text/Text';

const UNIQUE_ID_LENGTH = 5;

/**
 * QuickAddModal component
 *
 * This component renders a modal that allows users to quickly add courses to their schedule.
 * It provides dropdowns for selecting semester, field of study, course number, and section.
 * Alternatively, users can enter a unique number to add a course directly.
 */
export default function QuickAddModal(): JSX.Element {
    const [activeSchedule] = useSchedules();
    const uniqueNumber = useNumericInput('', UNIQUE_ID_LENGTH);
    const data = useQuickAddDropdowns();

    const handleAddCourse = async () => {
        if (!data.semester || (uniqueNumber.value.length !== UNIQUE_ID_LENGTH && !data.section)) return;
        const uniqueId = uniqueNumber.value.length === UNIQUE_ID_LENGTH ? uniqueNumber.value : data.section!.id;
        const courseUrl = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${data.semester.id}/${uniqueId}/`;
        await addCourseByURL(activeSchedule, courseUrl);
        uniqueNumber.reset();
        data.resetDropdowns();
    };

    console.log("data.fetchStatus", data.fetchStatus);
    return (
        <DialogProvider>
            <Popover>
                <PopoverButton className='bg-transparent' as='div'>
                    <Button color='ut-black' size='small' variant='minimal' icon={PlusCircle}>
                        Quick Add
                    </Button>
                </PopoverButton>
                <PopoverPanel
                    as={ExtensionRootWrapper}
                    className={clsx([
                        'mt-spacing-3',
                        'origin-top rounded bg-white text-black shadow-lg transition border border-ut-offwhite/50 focus:outline-none',
                        'data-[closed]:(opacity-0 scale-95)',
                        'data-[enter]:(ease-out-expo duration-150)',
                        'data-[leave]:(ease-out duration-50)',
                        'flex flex-col gap-spacing-7 px-spacing-7 py-spacing-6 w-[400px] z-20',
                    ])}
                    transition
                    anchor='bottom start'
                >
                    <div className='flex flex-col gap-spacing-6'>
                        <PopoverGroup className='flex flex-col gap-spacing-5'>
                            <Dropdown
                                placeholderText='Select Semester...'
                                options={data.semesters}
                                selectedOption={data.semester}
                                onOptionChange={(newOpt: DropdownOption) =>
                                    data.handleSemesterChange(newOpt as SemesterItem)
                                }
                                disabled={data.semesterDisabled}
                                icon={Calendar}
                            />
                            <Dropdown
                                placeholderText='Select Field of Study...'
                                options={data.fieldsOfStudy}
                                selectedOption={data.fieldOfStudy}
                                onOptionChange={(newOpt: DropdownOption) =>
                                    data.handleFieldOfStudyChange(newOpt as StudyField)
                                }
                                disabled={data.fieldOfStudyDisabled || uniqueNumber.value !== ''}
                                icon={GraduationCap}
                            />
                            <Dropdown
                                placeholderText='Select Course Number...'
                                options={data.courseNumbers}
                                selectedOption={data.courseNumber}
                                onOptionChange={(newOpt: DropdownOption) =>
                                    data.handleCourseNumberChange(newOpt as CourseItem)
                                }
                                disabled={data.courseNumberDisabled || uniqueNumber.value !== ''}
                                icon={ListNumbers}
                            />
                            <Dropdown
                                placeholderText='Select Section...'
                                options={data.sections}
                                selectedOption={data.section}
                                onOptionChange={(newOpt: DropdownOption) =>
                                    data.handleSectionChange(newOpt as SectionItem)
                                }
                                disabled={data.sectionDisabled || uniqueNumber.value !== ''}
                                icon={ChalkboardTeacher}
                            />
                            {data.fetchStatus === FetchStatus.ERROR &&
                                <Text className='text-center text-red-500'>
                                    Failed to fetch Courses data. Check console for more details.
                                </Text>
                            }
                            {data.fetchStatus === FetchStatus.LOADING &&
                                <div className='flex flex-row items-center justify-center gap-spacing-4'>
                                    <Spinner className="h-4 w-4 text-ut-black" />
                                    <Text className='text-center text-ut-black'>
                                        Loading data...
                                    </Text>
                                </div>
                            }

                        </PopoverGroup>
                        <div className='w-full flex flex-row items-center justify-center gap-spacing-4'>
                            <Divider orientation='horizontal' size='100%' />
                            <Text className='w-fit text-nowrap uppercase' variant='small'>
                                OR ADD BY UNIQUE NUMBER
                            </Text>
                            <Divider orientation='horizontal' size='100%' />
                        </div>
                        <Input
                            value={uniqueNumber.value}
                            onChange={uniqueNumber.handleChange}
                            maxLength={UNIQUE_ID_LENGTH}
                            placeholder='Enter Unique Number...'
                            icon={HashStraight}
                        />
                    </div>
                    <PopoverGroup className='w-full flex flex-row justify-end gap-spacing-5'>
                        <PopoverPanel>
                            {({ close }) => (
                                <Button
                                    color='ut-black'
                                    size='regular'
                                    variant='minimal'
                                    onClick={() => {
                                        uniqueNumber.reset();
                                        data.resetDropdowns();
                                        close();
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </PopoverPanel>
                        <Button
                            color='ut-green'
                            size='regular'
                            variant='filled'
                            icon={Plus}
                            onClick={handleAddCourse}
                            disabled={
                                !data.semester || (!data.section && uniqueNumber.value.length !== UNIQUE_ID_LENGTH)
                            }
                        >
                            Add Course
                        </Button>
                    </PopoverGroup>
                </PopoverPanel>
            </Popover>
        </DialogProvider>
    );
}
