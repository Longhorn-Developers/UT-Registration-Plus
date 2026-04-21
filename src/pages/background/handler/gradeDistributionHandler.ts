import type { MessageHandler } from '@chrome-extension-toolkit';
import type GradeDistributionMessages from '@shared/messages/GradeDistributionMessages';
import { Course } from '@shared/types/Course';
import {
    NoDataError,
    queryAggregateDistribution,
    querySemesterDistribution,
} from '@views/lib/database/queryDistribution';

const gradeDistributionHandler: MessageHandler<GradeDistributionMessages> = {
    async getAggregateGradeDistribution({ data, sendResponse }) {
        try {
            // Deserialize the Course object from the serialized data
            const course = new Course(data.course);

            const result = await queryAggregateDistribution(course);
            sendResponse({ success: true, data: result });
        } catch (error) {
            if (error instanceof NoDataError) {
                sendResponse({
                    success: false,
                    error: 'NO_DATA',
                    message: (error as Error).message,
                });
            } else {
                sendResponse({
                    success: false,
                    error: 'QUERY_ERROR',
                    message: (error as Error).message,
                });
            }
        }
    },

    async getSemesterGradeDistribution({ data, sendResponse }) {
        try {
            // Deserialize the Course object from the serialized data
            const course = new Course(data.course);

            const result = await querySemesterDistribution(course, data.semester);
            sendResponse({ success: true, data: result });
        } catch (error) {
            if (error instanceof NoDataError) {
                sendResponse({
                    success: false,
                    error: 'NO_DATA',
                    message: (error as Error).message,
                });
            } else {
                sendResponse({
                    success: false,
                    error: 'QUERY_ERROR',
                    message: (error as Error).message,
                });
            }
        }
    },
};

export default gradeDistributionHandler;
