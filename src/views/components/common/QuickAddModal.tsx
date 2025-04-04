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
import type { CourseNumberItem, FieldOfStudyItem, SectionItem, SemesterItem } from '@shared/types/CourseData';
import { generateSemesters } from '@shared/util/generateSemesters';
import { useNumericInput } from '@views/hooks/useNumericInput';
import { useQuickAddDropdowns } from '@views/hooks/useQuickAdd';
import useSchedules from '@views/hooks/useSchedules';
import { CourseDataService } from '@views/lib/getCoursesAndSections';
import clsx from 'clsx';
import React from 'react';

import { Button } from './Button';
import DialogProvider from './DialogProvider/DialogProvider';
import Divider from './Divider';
import type { DropdownOption } from './Dropdown';
import Dropdown from './Dropdown';
import { ExtensionRootWrapper } from './ExtensionRoot/ExtensionRoot';
import Input from './Input';
import Text from './Text/Text';

const UNIQUE_ID_LENGTH = 5;

const AVAILABLE_SEMESTERS = generateSemesters({ year: 2024, season: 'Fall' }, { year: 2025, season: 'Fall' });

const courseData = new CourseDataService();

/**
 * QuickAddModal component
 *
 * This component renders a button with a PlusCircle icon and the label "Quick Add".
 */
export default function QuickAddModal(): JSX.Element {
    const [activeSchedule] = useSchedules();
    const uniqueNumber = useNumericInput('', UNIQUE_ID_LENGTH);
    const data = useQuickAddDropdowns(
        AVAILABLE_SEMESTERS,
        courseData.getFieldsOfStudy,
        courseData.getCourseNumbers,
        courseData.getSections,
        () => uniqueNumber.reset()
    );

    const handleAddCourse = async () => {
        if (!data.semester || (uniqueNumber.value.length !== UNIQUE_ID_LENGTH && !data.section)) return;
        const uniqueId = uniqueNumber.value.length === UNIQUE_ID_LENGTH ? uniqueNumber.value : data.section!.id;
        const courseUrl = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${data.semester.id}/${uniqueId}/`;
        await addCourseByURL(activeSchedule, courseUrl);
        uniqueNumber.reset();
        data.resetDropdowns();
    };

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
                                    data.handleFieldOfStudyChange(newOpt as FieldOfStudyItem)
                                }
                                disabled={data.fieldOfStudyDisabled || uniqueNumber.value !== ''}
                                icon={GraduationCap}
                            />
                            <Dropdown
                                placeholderText='Select Course Number...'
                                options={data.courseNumbers}
                                selectedOption={data.courseNumber}
                                onOptionChange={(newOpt: DropdownOption) =>
                                    data.handleCourseNumberChange(newOpt as CourseNumberItem)
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
