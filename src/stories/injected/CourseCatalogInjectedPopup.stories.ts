/* eslint-disable storybook/story-exports */
// import { UserSchedule } from '@shared/types/UserSchedule';
// import type { Meta, StoryObj } from '@storybook/react';
// import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';

// import { exampleCourse } from './mocked';

// const exampleSchedule: UserSchedule = new UserSchedule({
//     courses: [exampleCourse],
//     name: 'Example Schedule',
//     hours: 0,
// });
// TODO (achadaga): import this after
// https://github.com/Longhorn-Developers/UT-Registration-Plus/pull/106 is merged
// const bevoCourse: Course = new Course({
//     uniqueId: 47280,
//     number: '311C',
//     fullName: "BVO 311C BEVO'S SEMINAR LONGHORN CARE",
//     courseName: "BEVO'S SEMINAR LONGHORN CARE",
//     department: 'BVO',
//     creditHours: 3,
//     status: Status.OPEN,
//     instructors: [new Instructor({ fullName: 'BEVO', firstName: '', lastName: 'BEVO', middleInitial: '' })],
//     isReserved: false,
//     description: [
//         'Restricted to Students in the School of Longhorn Enthusiasts',
//         'Immerse yourself in the daily routine of a longhorn—sunrise pasture walks and the best shady spots for a midday siesta. Understand the behavioral science behind our mascot’s stoic demeanor during games.',
//         'BVO 311C and 312H may not both be counted.',
//         'Prerequisite: Grazing 311 or 311H.',
//         'May be counted toward the Independent Inquiry flag requirement. May be counted toward the Writing flag requirement',
//         'Offered on the letter-grade basis only.',
//     ],
//     schedule: new CourseSchedule({
//         meetings: [
//             new CourseMeeting({
//                 days: ['Tuesday', 'Thursday'],
//                 startTime: 480,
//                 endTime: 570,
//                 location: { building: 'UTC', room: '123' },
//             }),
//             new CourseMeeting({
//                 days: ['Thursday'],
//                 startTime: 570,
//                 endTime: 630,
//                 location: { building: 'JES', room: '123' },
//             }),
//         ],
//     }),
//     url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
//     flags: ['Independent Inquiry', 'Writing'],
//     instructionMode: 'In Person',
//     semester: {
//         code: '12345',
//         year: 2024,
//         season: 'Spring',
//     },
// });

// const meta = {
//     title: 'Components/Injected/CourseCatalogInjectedPopup',
//     component: CourseCatalogInjectedPopup,
//     args: {
//         course: exampleCourse,
//         activeSchedule: exampleSchedule,
//         onClose: () => {},
//     },
//     argTypes: {
//         course: {
//             control: {
//                 type: 'object',
//             },
//         },
//         activeSchedule: {
//             control: {
//                 type: 'object',
//             },
//         },
//         onClose: {
//             control: {
//                 type: 'function',
//             },
//         },
//     },
// } satisfies Meta<typeof CourseCatalogInjectedPopup>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// export const OpenCourse: Story = {
//     args: {
//         course: exampleCourse,
//         activeSchedule: exampleSchedule,
//         onClose: () => {},
//     },
// };

// export const ClosedCourse: Story = {
//     args: {
//         course: {
//             ...exampleCourse,
//             status: Status.CLOSED,
//         } satisfies Course,
//     },
// };

// export const CourseWithNoData: Story = {
//     args: {
//         course: bevoCourse,
//     },
// };
export default {};
