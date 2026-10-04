import type { MessageHandler } from '@chrome-extension-toolkit';
import type GradeDistributionMessages from '@shared/messages/GradeDistributionMessages';
import { Course } from '@shared/types/Course';
import {
    NoDataError,
    queryAggregateDistribution,
    querySemesterDistribution,
} from '@views/lib/database/queryDistribution';

/**
 * Grade distribution queries run in the background rather than in the content script because
 * sql.js cannot be instantiated from a Firefox content script: Xray wrappers block access to
 * the wasm Database constructor ("Permission denied to access property 'constructor'").
 * The background context has no such restriction, so both browsers query here.
 */
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
