import PopupCourseBlock from '@views/components/common/PopupCourseBlock';
import { SortableList } from '@views/components/common/SortableList';
import Text from '@views/components/common/Text/Text';
import useSchedules, { replaceSchedule } from '@views/hooks/useSchedules';
import type { JSX } from 'react';
import CaretDownFillIcon from '~icons/ph/caret-down-fill';
import CaretUpFillIcon from '~icons/ph/caret-up-fill';

/**
 * Schedule list for the registration page sidebar.
 * Every schedule is listed, and the active one is expanded to show its courses.
 *
 * @returns The schedule list
 */
export default function SidebarScheduleList(): JSX.Element {
    const [activeSchedule, schedules] = useSchedules();

    return (
        <>
            {schedules.map(schedule => {
                const isActive = schedule.id === activeSchedule.id;

                return (
                    <div key={schedule.id} className='flex flex-col border border-divider/50 rounded bg-surface-raised'>
                        <div className='flex items-center px-3.5 py-2.5'>
                            <div className='min-w-0 flex-1'>
                                <Text as='div' variant='h3' className='truncate text-ut-burntorange normal-case!'>
                                    {schedule.name}
                                </Text>
                                <Text variant='h4' as='p' className='mt-0.5 inline-flex gap-3 text-content-muted'>
                                    <span>
                                        {schedule.hours}&nbsp;
                                        <span className='ml-0.5 uppercase'>
                                            {schedule.hours === 1 ? 'Hour' : 'Hours'}
                                        </span>
                                    </span>
                                    <span>
                                        {schedule.courses.length}&nbsp;
                                        <span className='ml-0.5 uppercase'>
                                            {schedule.courses.length === 1 ? 'Course' : 'Courses'}
                                        </span>
                                    </span>
                                </Text>
                            </div>
                            <Text className='text-ut-burntorange text-2xl! font-normal!'>
                                {isActive ? <CaretUpFillIcon /> : <CaretDownFillIcon />}
                            </Text>
                        </div>
                        {isActive && (
                            <div className='px-3.5 pb-3.5'>
                                {schedule.courses.length > 0 ? (
                                    <SortableList
                                        draggables={schedule.courses.map(course => ({ id: course.uniqueId, course }))}
                                        onChange={reordered => {
                                            schedule.courses = reordered.map(({ course }) => course);
                                            replaceSchedule(schedule, schedule);
                                        }}
                                        renderItem={({ id, course }) => (
                                            <PopupCourseBlock key={id} course={course} colors={course.colors} />
                                        )}
                                    />
                                ) : (
                                    <Text variant='small' as='p' className='text-center text-content'>
                                        (No courses added)
                                    </Text>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
}
