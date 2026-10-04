import type { Course, Semester } from '@shared/types/Course';
import type { Distribution } from '@shared/types/Distribution';

export type GradeDistributionResult<T> =
    | { success: true; data: T }
    | { success: false; error: 'NO_DATA' | 'QUERY_ERROR'; message: string };

interface GradeDistributionMessages {
    /**
     * Fetches the aggregate grade distribution for a course
     *
     * @param data - The course to fetch distribution for
     * @returns Result containing [Distribution, semesters[], instructorIncluded] or error
     */
    getAggregateGradeDistribution: (data: {
        course: Course;
    }) => GradeDistributionResult<[Distribution, Semester[], boolean]>;

    /**
     * Fetches the grade distribution for a specific semester
     *
     * @param data - The course and semester to fetch distribution for
     * @returns Result containing [Distribution, instructorIncluded] or error
     */
    getSemesterGradeDistribution: (data: {
        course: Course;
        semester: Semester;
    }) => GradeDistributionResult<[Distribution, boolean]>;
}

export default GradeDistributionMessages;
