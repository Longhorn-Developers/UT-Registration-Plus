import { Course, Status } from '@shared/types/Course';
import { CourseMeeting, DAY_MAP } from '@shared/types/CourseMeeting';
import Instructor from '@shared/types/Instructor';
import { UserSchedule } from '@shared/types/UserSchedule';
import { getCourseColors } from '@shared/util/colors';

export const exampleCourse: Course = new Course({
    courseName: 'ELEMS OF COMPTRS/PROGRAMMNG-WB',
    creditHours: 3,
    department: 'C S',
    description: [
        'Problem solving and fundamental algorithms for various applications in science, business, and on the World Wide Web, and introductory programming in a modern object-oriented programming language.',
        'Only one of the following may be counted: Computer Science 303E, 312, 312H. Credit for Computer Science 303E may not be earned after a student has received credit for Computer Science 314, or 314H. May not be counted toward a degree in computer science.',
        'May be counted toward the Quantitative Reasoning flag requirement.',
        'Designed to accommodate 100 or more students.',
        'Taught as a Web-based course.',
    ],
    flags: ['Quantitative Reasoning'],
    core: ['Natural Science and Technology, Part I'],
    fullName: 'C S 303E ELEMS OF COMPTRS/PROGRAMMNG-WB',
    instructionMode: 'Online',
    scrapedAt: Date.now(),
    instructors: [
        new Instructor({
            firstName: 'William',
            lastName: 'Young',
            middleInitial: 'D',
            fullName: 'William D Young',
        }),
        new Instructor({
            firstName: 'William',
            lastName: 'Young',
            middleInitial: 'D',
            fullName: 'William D Young',
        }),
    ],
    isReserved: false,
    number: '303E',
    schedule: {
        meetings: [
            new CourseMeeting({
                days: ['Tuesday', 'Thursday'],
                endTime: 660,
                startTime: 570,
            }),
        ],
    },
    semester: {
        code: '12345',
        season: 'Spring',
        year: 2024,
    },
    status: Status.OPEN,
    uniqueId: 12345,
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
    colors: getCourseColors('blue', 500),
});

export const exampleSchedule: UserSchedule = new UserSchedule({
    courses: [exampleCourse],
    id: 'az372389blep',
    name: 'Example Schedule',
    hours: 3,
    updatedAt: Date.now(),
});

export const bevoCourse: Course = new Course({
    uniqueId: 47280,
    number: '311C',
    fullName: "BVO 311C BEVO'S SEMINAR LONGHORN CARE",
    courseName: "BEVO'S SEMINAR LONGHORN CARE",
    department: 'BVO',
    creditHours: 3,
    status: Status.OPEN,
    instructors: [new Instructor({ fullName: 'BEVO', firstName: '', lastName: 'BEVO', middleInitial: '' })],
    isReserved: false,
    description: [
        'Restricted to Students in the School of Longhorn Enthusiasts',
        'Immerse yourself in the daily routine of a longhorn—sunrise pasture walks and the best shady spots for a midday siesta. Understand the behavioral science behind our mascot’s stoic demeanor during games.',
        'BVO 311C and 312H may not both be counted.',
        'Prerequisite: Grazing 311 or 311H.',
        'May be counted toward the Independent Inquiry flag requirement. May be counted toward the Writing flag requirement',
        'Offered on the letter-grade basis only.',
    ],
    schedule: {
        meetings: [
            new CourseMeeting({
                days: ['Tuesday', 'Thursday'],
                startTime: 480,
                endTime: 570,
                location: { building: 'UTC', room: '123' },
            }),
            new CourseMeeting({
                days: ['Thursday'],
                startTime: 570,
                endTime: 630,
                location: { building: 'JES', room: '123' },
            }),
        ],
    },
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
    flags: ['Independent Inquiry', 'Writing'],
    core: ['Humanities'],
    instructionMode: 'In Person',
    semester: {
        code: '12345',
        year: 2024,
        season: 'Spring',
    },
    scrapedAt: Date.now(),
    colors: getCourseColors('green', 500),
});

export const bevoSchedule: UserSchedule = new UserSchedule({
    courses: [bevoCourse],
    id: 'bevoshenanigans52',
    name: 'Bevo Schedule',
    hours: 3,
    updatedAt: Date.now(),
});

export const mikeScottCS314Course: Course = new Course({
    uniqueId: 50805,
    number: '314',
    fullName: 'C S 314 DATA STRUCTURES',
    courseName: 'DATA STRUCTURES',
    department: 'C S',
    creditHours: 3,
    status: Status.OPEN,
    instructors: [
        new Instructor({ fullName: 'SCOTT, MICHAEL', firstName: 'MICHAEL', lastName: 'SCOTT', middleInitial: 'D' }),
    ],
    isReserved: true,
    description: [
        'Second part of a two-part sequence in programming. Introduction to specifications, simple unit testing, and debugging; building and using canonical data structures; algorithm analysis and reasoning techniques such as assertions and invariants.',
        'Computer Science 314 and 314H may not both be counted.',
        'BVO 311C and 312H may not both be counted.',
        'Prerequisite: Computer Science 312 or 312H with a grade of at least C-.',
        'May be counted toward the Quantitative Reasoning flag requirement.',
    ],
    schedule: {
        meetings: [
            new CourseMeeting({
                days: [DAY_MAP.T, DAY_MAP.TH],
                startTime: 480,
                endTime: 570,
                location: { building: 'UTC', room: '123' },
            }),
            new CourseMeeting({
                days: [DAY_MAP.TH],
                startTime: 570,
                endTime: 630,
                location: { building: 'JES', room: '123' },
            }),
        ],
    },
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/50825/',
    flags: ['Writing', 'Independent Inquiry'],
    core: ['Natural Science and Technology, Part II'],
    instructionMode: 'In Person',
    semester: {
        code: '12345',
        year: 2024,
        season: 'Spring',
    },
    scrapedAt: Date.now(),
    colors: getCourseColors('orange', 500),
});

export const mikeScottCS314Schedule: UserSchedule = new UserSchedule({
    courses: [mikeScottCS314Course],
    id: 'omgitsmikescott314',
    name: 'Mike Scott CS314 Schedule',
    hours: 3,
    updatedAt: Date.now(),
});

export const multiMeetingMultiInstructorCourse: Course = new Course({
    colors: {
        primaryColor: '#ef4444',
        secondaryColor: '#991b1b',
    },
    core: [],
    courseName: '44-REPORTING TEXAS',
    creditHours: 3,
    department: 'J',
    description: [
        "Contemporary social, professional, and intellectual concerns with the practice of journalism. Students work as online reporters, photographers, and editors for the School of Journalism's Reporting Texas Web site.",
        'Prerequisite: Graduate standing; additional prerequisites vary with the topic.',
        'Designed to accommodate 35 or fewer students. Course number may be repeated for credit when the topics vary.',
    ],
    flags: [],
    fullName: 'J 395 44-REPORTING TEXAS',
    instructionMode: 'In Person',
    instructors: [
        {
            firstName: 'JOHN',
            fullName: 'SCHWARTZ, JOHN R',
            lastName: 'SCHWARTZ',
            middleInitial: 'R',
        },
        {
            firstName: 'JOHN',
            fullName: 'BRIDGES, JOHN A III',
            lastName: 'BRIDGES',
            middleInitial: 'A',
        },
    ],
    isReserved: true,
    number: '395',
    schedule: {
        meetings: [
            {
                days: ['Tuesday', 'Thursday'],
                endTime: 660,
                location: {
                    building: 'CMA',
                    room: '6.146',
                },
                startTime: 570,
            },
            {
                days: ['Friday'],
                endTime: 960,
                location: {
                    building: 'DMC',
                    room: '3.208',
                },
                startTime: 780,
            },
        ],
    },
    scrapedAt: 1742491957535,
    semester: {
        code: '20259',
        season: 'Fall',
        year: 2025,
    },
    status: 'OPEN',
    uniqueId: 10335,
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20259/10335/',
});

export const multiMeetingMultiInstructorSchedule: UserSchedule = new UserSchedule({
    courses: [multiMeetingMultiInstructorCourse],
    id: 'mmmis',
    name: 'Multi Meeting Multi Instructor Schedule',
    hours: 3,
    updatedAt: Date.now(),
});

export const chatterjeeCS429Course: Course = new Course({
    colors: {
        primaryColor: '#0284c7',
        secondaryColor: '#0c4a6e',
    },
    core: [],
    courseName: 'COMP ORGANIZATN AND ARCH',
    creditHours: 4,
    department: 'C S',
    description: [
        'Restricted to computer science majors.',
        'An introduction to low-level computer design ranging from the basics of digital design to the hardware/software interface for application programs. Includes basic systems principles of pipelining and caching, and requires writing and understanding programs at multiple levels.',
        'Computer Science 429 and 429H may not both be counted.',
        'Prerequisite: The following courses with a grade of at least C-: Computer Science 311 or 311H; and Computer Science 314 or 314H.',
    ],
    flags: [],
    fullName: 'C S 429 COMP ORGANIZATN AND ARCH',
    instructionMode: 'In Person',
    instructors: [
        {
            firstName: 'SIDDHARTHA',
            fullName: 'CHATTERJEE, SIDDHARTHA',
            lastName: 'CHATTERJEE',
        },
    ],
    isReserved: true,
    number: '429',
    schedule: {
        meetings: [
            {
                days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
                endTime: 1020,
                location: {
                    building: 'UTC',
                    room: '3.102',
                },
                startTime: 960,
            },
            {
                days: ['Friday'],
                endTime: 660,
                location: {
                    building: 'GSB',
                    room: '2.122',
                },
                startTime: 540,
            },
        ],
    },
    scrapedAt: 1742496630445,
    semester: {
        code: '20259',
        season: 'Fall',
        year: 2025,
    },
    status: 'OPEN',
    uniqueId: 54795,
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20259/54795/',
});
