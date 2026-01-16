import { Trash } from '@phosphor-icons/react';
import { OptionsStore } from '@shared/storage/OptionsStore';
import MIMEType from '@shared/types/MIMEType';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { handleExportJson } from '@views/components/calendar/utils';
import { Button } from '@views/components/common/Button';
import Divider from '@views/components/common/Divider';
import SwitchButton from '@views/components/common/SwitchButton';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

import FileUpload from '../common/FileUpload';
import { DISPLAY_PREVIEWS, PREVIEW_SECTION_DIV_CLASSNAME } from './constants';
import Preview from './Preview';

interface AdvancedSettingsProps {
    highlightConflicts: boolean;
    setHighlightConflicts: (value: boolean) => void;
    loadAllCourses: boolean;
    setLoadAllCourses: (value: boolean) => void;
    increaseScheduleLimit: boolean;
    setIncreaseScheduleLimit: (value: boolean) => void;
    calendarNewTab: boolean;
    setCalendarNewTab: (value: boolean) => void;
    activeSchedule: UserSchedule;
    handleEraseAll: () => void;
    handleImportClick: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

/**
 * Settings section component for advanced settings
 */
export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
    highlightConflicts,
    setHighlightConflicts,
    loadAllCourses,
    setLoadAllCourses,
    increaseScheduleLimit,
    setIncreaseScheduleLimit,
    calendarNewTab,
    setCalendarNewTab,
    activeSchedule,
    handleEraseAll,
    handleImportClick,
}) => (
    <section className='mb-8'>
        <h2 className='mb-4 text-xl text-ut-black font-semibold'>ADVANCED SETTINGS</h2>
        <div className='flex space-x-4'>
            <div className={PREVIEW_SECTION_DIV_CLASSNAME}>
                <div className='flex items-center justify-between'>
                    <div className='max-w-xs'>
                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                            Export Current Schedule
                        </Text>
                        <p className='text-sm text-gray-600'>Backup your active schedule to a portable file</p>
                    </div>
                    <Button
                        variant='outline'
                        color='ut-burntorange'
                        onClick={() => handleExportJson(activeSchedule.id)}
                    >
                        Export
                    </Button>
                </div>

                <Divider size='auto' orientation='horizontal' />

                <div className='flex items-center justify-between'>
                    <div className='max-w-xs'>
                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                            Import Schedule
                        </Text>
                        <p className='text-sm text-gray-600'>Import from a schedule file</p>
                    </div>
                    <FileUpload
                        variant='filled'
                        color='ut-burntorange'
                        onChange={handleImportClick}
                        accept={MIMEType.JSON}
                    >
                        Import Schedule
                    </FileUpload>
                </div>

                <Divider size='auto' orientation='horizontal' />

                <div className='flex items-center justify-between'>
                    <div className='max-w-xs'>
                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                            Course Conflict Highlight
                        </Text>
                        <p className='text-sm text-gray-600'>
                            Adds a red strikethrough to courses that have conflicting times.
                        </p>
                    </div>
                    <SwitchButton
                        isChecked={highlightConflicts}
                        onChange={() => {
                            setHighlightConflicts(!highlightConflicts);
                            OptionsStore.set('enableHighlightConflicts', !highlightConflicts);
                        }}
                    />
                </div>

                <Divider size='auto' orientation='horizontal' />

                <div className='flex items-center justify-between'>
                    <div className='max-w-xs'>
                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                            Load All Courses in Course Schedule
                        </Text>
                        <p className='text-sm text-gray-600'>
                            Loads all courses in the Course Schedule site by scrolling, instead of using next/prev page
                            buttons.
                        </p>
                    </div>
                    <SwitchButton
                        isChecked={loadAllCourses}
                        onChange={() => {
                            setLoadAllCourses(!loadAllCourses);
                            OptionsStore.set('enableScrollToLoad', !loadAllCourses);
                        }}
                    />
                </div>

                <Divider size='auto' orientation='horizontal' />

                <div className='flex items-center justify-between'>
                    <div className='max-w-xs'>
                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                            Allow more than 10 schedules
                        </Text>
                        <p className='text-sm text-gray-600'>
                            Allow bypassing the 10-schedule limit. Intended for advisors or staff who need to create
                            many schedules on behalf of students.
                        </p>
                    </div>
                    <SwitchButton
                        isChecked={increaseScheduleLimit}
                        onChange={() => {
                            setIncreaseScheduleLimit(!increaseScheduleLimit);
                            OptionsStore.set('allowMoreSchedules', !increaseScheduleLimit);
                        }}
                    />
                </div>

                <Divider size='auto' orientation='horizontal' />

                <div className='flex items-center justify-between'>
                    <div className='max-w-xs'>
                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                            Always Open Calendar in New Tab
                        </Text>
                        <p className='text-sm text-gray-600'>
                            Always opens the calendar view in a new tab when navigating to the calendar page. May
                            prevent issues where the calendar refuses to open.
                        </p>
                    </div>
                    <SwitchButton
                        isChecked={calendarNewTab}
                        onChange={() => {
                            setCalendarNewTab(!calendarNewTab);
                            OptionsStore.set('alwaysOpenCalendarInNewTab', !calendarNewTab);
                        }}
                    />
                </div>

                <Divider size='auto' orientation='horizontal' />

                <div className='flex items-center justify-between'>
                    <div className='max-w-xs'>
                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                            Reset All Data
                        </Text>
                        <p className='text-sm text-gray-600'>Erases all schedules and courses you have.</p>
                    </div>
                    <Button variant='outline' color='theme-red' icon={Trash} onClick={handleEraseAll}>
                        Erase All
                    </Button>
                </div>
            </div>
            {DISPLAY_PREVIEWS && (
                <Preview>
                    <Text
                        variant='h2-course'
                        className={clsx('text-center text-theme-red font-normal', {
                            'line-through': highlightConflicts,
                        })}
                    >
                        01234 MWF 10:00 AM - 11:00 AM UTC 1.234
                    </Text>
                </Preview>
            )}
        </div>
    </section>
);
