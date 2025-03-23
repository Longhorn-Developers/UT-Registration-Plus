import { usePrompt } from '@views/components/common/DialogProvider/DialogProvider';
import { Button } from '@views/components/common/Button';
import React, { useCallback } from 'react';
import { UserSchedule } from 'src/shared/types/UserSchedule';
import useSchedules from '@views/hooks/useSchedules';
import type { Course } from '@shared/types/Course';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
/**
 * Hook that enforces adding courses only within the same semester.
 *
 * If the course semester matches the current semester, the function returns true.
 * Otherwise, it shows a prompt warning the user, giving an option to proceed anyway or cancel.
 *
 * @returns a callback function that enforces the semester rule via a dialog.
 */
export function useEnforceSameSemesterCourse(): (
    course: Course, addCourseCallback: () => void) => boolean {
    const showPrompt = usePrompt();
    const [activeSchedule, schedules] = useSchedules();
    console.log("Reached inside of useEnforceSameSemesterCourse");

  return useCallback(
    (course, addCourseCallback) => {
    const classSemesterCode = course.semester.code;
    const currentSemesterCode = activeSchedule.courses[0]?.semester.code;

      if (classSemesterCode === currentSemesterCode) {
        return true;
      }

      showPrompt({
        title: 'Semester Mismatch',
        description: (
          <>
            <p>The class you are adding is in a different semester (Code: {classSemesterCode}).</p>
            <p>
              Your current semester is <strong>{currentSemesterCode}</strong>.
            </p>
          </>
        ),
        buttons: (close) => (
          <>
            <Button
              variant='filled'
              color='ut-burntorange'
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              variant='filled'
              color='ut-burntorange'
              onClick={() => {
                addCourseCallback();
                close();
              }}
            >
              Proceed Anyway
            </Button>
          </>
        ),
      });

      return false;
    },
    [showPrompt]
  );
}


// import { usePrompt } from '@views/components/common/DialogProvider/DialogProvider';
// import { Button } from '@views/components/common/Button';
// import React from 'react';

// // This is a custom hook to return the dialog function
// export function useShowSemesterWarningDialog() {
//   const showPrompt = usePrompt();
//   console.log ("Got to useShowSemesterWarningDialog()");
//   return (classSemesterCode: string | undefined, currentSemesterCode: string | undefined, addCourseCallback: () => void) => {
//     showPrompt({
//       title: 'Semester Mismatch',
//       description: (
//         <>
//           <p>The class you are adding is in a different semester (Code: {classSemesterCode}).</p>
//         </>
//       ),
//       buttons: (close) => (
//         <>
//           <Button
//             variant='filled'
//             color='ut-burntorange'
//             onClick={() => {
//               close();
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant='filled'
//             color='ut-burntorange'
//             onClick={() => {
//               addCourseCallback();
//               close();
//             }}
//           >
//             Proceed Anyway
//           </Button>
//         </>
//       ),
//     });
//   };
// }
