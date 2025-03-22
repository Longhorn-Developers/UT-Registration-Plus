import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';
import { getUnusedColor } from '@shared/util/colors';
// import { usePrompt } from '@views/components/common/DialogProvider/DialogProvider';
// import { Button } from '../../../views/components/common/Button';
import { useEnforceSameSemesterCourse } from '@views/hooks/useEnforceSameSemesterCourse';
/**
 * Adds a course to a user's schedule.
 *
 * @param scheduleId - The id of the schedule to add the course to.
 * @param course - The course to add.
 * @param hasColor - If the course block already has colors manually set
 * @returns A promise that resolves to void.
 * @throws An error if the schedule is not found.
 */
export default async function addCourse(
    scheduleId: string,
    course: Course,
    showSemesterWarningDialog: (classSemesterCode: string|undefined, currentSemesterCode: string|undefined, addCourseCallback: () => void) => void,
    hasColor = false
    ): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');
    const activeSchedule = schedules.find(s => s.id === scheduleId);
    if (!activeSchedule) {
        throw new Error('Schedule not found');
    }

    if (!hasColor) {
        course.colors = getUnusedColor(activeSchedule, course);
    }
    // console.log("classSemesterCode: ", course.semester.code);
    // console.log("currentSemesterCode: ", activeSchedule.courses.length);

    // // Check for semester code mismatch
    // // if(activeSchedule.courses){
    //     if ((activeSchedule.courses.length !== 0) && course.semester.code !== activeSchedule.courses[0]?.semester.code) {
    //         showSemesterWarningDialog(course.semester.code, activeSchedule.courses[0]?.semester.code, addCourseDirect(scheduleId, course));
    //         return;
    //     }
    // // }

    console.log("classSemesterCode: ", course.semester.code);
    console.log("currentSemesterCode: ", activeSchedule.courses.length);

    // const showSemesterWarningDialog = useEnforceSameSemesterCourse();
    console.log("gets here");
    // if (activeSchedule.courses.length !== 0 && course.semester.code !== activeSchedule.courses[0]?.semester.code) {
    //   showSemesterWarningDialog(
    //     course.semester.code,
    //     activeSchedule.courses[0]?.semester.code,
    //     () => addCourseDirect(scheduleId, course)
    //   );
    //   return;
    // }
     // If there are courses and the semester codes do not match, use the provided dialog function.
    if (
        activeSchedule.courses.length !== 0 &&
        course.semester.code !== activeSchedule.courses[0]?.semester.code
    ) {
        // if (showSemesterWarningDialog) {
        showSemesterWarningDialog(
            course.semester.code,
            activeSchedule.courses[0]?.semester.code,
            () => addCourseDirect(scheduleId, course)
        );
        return;
        // }
    }

    addCourseDirect(scheduleId, course);
}
async function addCourseDirect(scheduleId: string, course: Course): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');
    const activeSchedule = schedules.find(s => s.id === scheduleId);

    if (!activeSchedule) {
      throw new Error('Schedule not found');
    }

    activeSchedule.courses.push(course);
    activeSchedule.updatedAt = Date.now();
    await UserScheduleStore.set('schedules', schedules);
    console.log(`Course added: ${course.courseName} (ID: ${course.uniqueId})`);
}
