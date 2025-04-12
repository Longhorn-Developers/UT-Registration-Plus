import fetchCourseNumbers from '@pages/background/lib/fetchCourses';
import fetchSections from '@pages/background/lib/fetchSections';
import type { CourseCatalogMessages } from '@shared/messages/CourseCatalogMessages';
import type { MessageHandler } from 'chrome-extension-toolkit';

const courseCatalogHandler: MessageHandler<CourseCatalogMessages> = {
    fetchCourses({ data, sendResponse }) {
        sendResponse(fetchCourseNumbers(data.semester, data.fieldOfStudyId));
    },
    fetchSections({ data, sendResponse }) {
        sendResponse(fetchSections(data.semester, data.course));
    },
};

export default courseCatalogHandler;
