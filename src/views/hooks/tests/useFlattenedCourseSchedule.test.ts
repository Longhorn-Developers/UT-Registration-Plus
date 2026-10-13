import type { Serialized } from '@chrome-extension-toolkit';
import { Course, Status } from '@shared/types/Course';
import type { CourseMeeting } from '@shared/types/CourseMeeting';
import { describe, expect, it } from 'vitest';

import { convertMinutesToIndex, GRID_DEFAULT_START, processPreviewCourse } from '../useFlattenedCourseSchedule';

const makeCourse = (uniqueId: number, department: string, meetings: Serialized<CourseMeeting>[]): Course =>
    new Course({
        uniqueId,
        number: '314',
        fullName: `${department} 314`,
        courseName: 'TEST COURSE',
        department,
        creditHours: 3,
        status: Status.OPEN,
        instructors: [],
        isReserved: false,
        schedule: { meetings },
        url: '',
        flags: [],
        instructionMode: 'In Person',
        semester: { year: 2026, season: 'Fall', code: '20269' },
        scrapedAt: 0,
        colors: { primaryColor: '#000000', secondaryColor: '#000000' },
        core: [],
    });

describe('useFlattenedCourseSchedule', () => {
    describe('convertMinutesToIndex', () => {
        it('should use 8 AM as the default grid start', () => {
            const minutes = 480; // 8:00 AM
            // (480 - 480) / 30 + 2 + 1 = 3
            expect(convertMinutesToIndex(minutes)).toBe(3);
        });

        it('should adjust index when a course starts before 8 AM (dynamic start)', () => {
            const gridStart = 360; // 6:00 AM — pushed back by an early course
            const minutes = 480; // 8:00 AM course
            // (480 - 360) / 30 + 2 + 1 = 7
            expect(convertMinutesToIndex(minutes, gridStart)).toBe(7);
        });

        it('should index a 6 AM course at row 3 when grid starts at 6 AM', () => {
            const gridStart = 360; // 6:00 AM
            const minutes = 360; // 6:00 AM course
            // (360 - 360) / 30 + 2 + 1 = 3
            expect(convertMinutesToIndex(minutes, gridStart)).toBe(3);
        });

        it('should use GRID_DEFAULT_START as the default parameter', () => {
            expect(convertMinutesToIndex(GRID_DEFAULT_START)).toBe(3);
        });
    });

    describe('processPreviewCourse', () => {
        it('should mark a conflict only on the days the schedule overlaps', () => {
            // MWF 10:00-10:50 against a course that meets Friday 10:00-10:30
            const preview = makeCourse(1, 'C S', [
                { days: ['Monday', 'Wednesday', 'Friday'], startTime: 600, endTime: 650 },
            ]);
            const scheduled = makeCourse(2, 'M', [{ days: ['Friday'], startTime: 600, endTime: 630 }]);

            const cells = processPreviewCourse(preview, [scheduled], GRID_DEFAULT_START);

            expect(cells.map(c => [c.calendarGridPoint.dayIndex, c.conflicts.map(x => x.uniqueId)])).toEqual([
                [0, []],
                [2, []],
                [4, [2]],
            ]);
        });

        it('should not count back-to-back meetings as a conflict', () => {
            const preview = makeCourse(1, 'C S', [{ days: ['Tuesday', 'Thursday'], startTime: 570, endTime: 660 }]);
            const scheduled = makeCourse(2, 'M', [{ days: ['Tuesday', 'Thursday'], startTime: 660, endTime: 750 }]);

            const cells = processPreviewCourse(preview, [scheduled], GRID_DEFAULT_START);

            expect(cells).toHaveLength(2);
            expect(cells.every(c => c.conflicts.length === 0)).toBe(true);
        });

        it('should place the cells on the grid like the scheduled courses', () => {
            // Tuesday 9:30-11:00 on a grid starting at 8 AM: rows (570 - 480) / 30 + 3 = 6 to (660 - 480) / 30 + 3 = 9
            const preview = makeCourse(1, 'C S', [{ days: ['Tuesday'], startTime: 570, endTime: 660 }]);

            const [cell] = processPreviewCourse(preview, [], GRID_DEFAULT_START);

            expect(cell?.calendarGridPoint).toEqual({ dayIndex: 1, startIndex: 6, endIndex: 9 });
            expect(cell?.async).toBe(false);
        });

        it('should leave out Saturday meetings, which the calendar shows below the grid', () => {
            const preview = makeCourse(1, 'C S', [{ days: ['Saturday'], startTime: 540, endTime: 720 }]);

            expect(processPreviewCourse(preview, [], GRID_DEFAULT_START)).toEqual([]);
        });
    });
});
