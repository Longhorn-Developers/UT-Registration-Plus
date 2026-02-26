import type { MessageHandler } from '@chrome-extension-toolkit';
import fetchAllCourseNumbers from '@pages/background/lib/fetchCourses';
import fetchAllFieldsOfStudy from '@pages/background/lib/fetchFieldsOfStudy';
import fetchSections from '@pages/background/lib/fetchSections';
import fetchAvailableSemesters from '@pages/background/lib/fetchSemesters';
import type { CourseCatalogMessages } from '@shared/messages/CourseCatalogMessages';

const courseCatalogHandler: MessageHandler<CourseCatalogMessages> = {
    fetchAvailableSemesters({ sendResponse }) {
        fetchAvailableSemesters().then(sendResponse);
    },
    fetchAllFieldsOfStudy({ data, sendResponse }) {
        fetchAllFieldsOfStudy(data.semester).then(sendResponse);
    },
    fetchAllCourses({ data, sendResponse }) {
        fetchAllCourseNumbers(data.semester).then(sendResponse);
    },
    fetchSections({ data, sendResponse }) {
        fetchSections(data.semester, data.course).then(sendResponse);
    },
};

export default courseCatalogHandler;
