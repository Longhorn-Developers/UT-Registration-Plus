import addCourse from '@pages/background/lib/addCourse';
import clearCourses from '@pages/background/lib/clearCourses';
import createSchedule from '@pages/background/lib/createSchedule';
import deleteSchedule from '@pages/background/lib/deleteSchedule';
import removeCourse from '@pages/background/lib/removeCourse';
import renameSchedule from '@pages/background/lib/renameSchedule';
import switchSchedule from '@pages/background/lib/switchSchedule';
import type { UserScheduleMessages } from '@shared/messages/UserScheduleMessages';
import { Course } from '@shared/types/Course';
import type { MessageHandler } from 'chrome-extension-toolkit';
import { UserScheduleStore } from 'src/shared/storage/UserScheduleStore';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import { StatusType } from '@shared/types/Course'; 
import { Serialized } from 'chrome-extension-toolkit';


const userScheduleHandler: MessageHandler<UserScheduleMessages> = {
    addCourse({ data, sendResponse }) {
        checkCourseStatusChanges();
        addCourse(data.scheduleId, new Course(data.course)).then(sendResponse);
    },
    removeCourse({ data, sendResponse }) {
        console.log("TEST")
        checkCourseStatusChanges();
        removeCourse(data.scheduleId, new Course(data.course)).then(sendResponse);
    },
    clearCourses({ data, sendResponse }) {
        checkCourseStatusChanges();
        clearCourses(data.scheduleId).then(sendResponse);
    },
    switchSchedule({ data, sendResponse }) {
        checkCourseStatusChanges();
        switchSchedule(data.scheduleId).then(sendResponse);
    },
    createSchedule({ data, sendResponse }) {
        checkCourseStatusChanges();
        createSchedule(data.scheduleName).then(sendResponse);
    },
    deleteSchedule({ data, sendResponse }) {
        checkCourseStatusChanges();
        deleteSchedule(data.scheduleId).then(sendResponse);
    },
    renameSchedule({ data, sendResponse }) {
        checkCourseStatusChanges();
        renameSchedule(data.scheduleId, data.newName).then(sendResponse);
    },
    // proxy so we can add courses
    addCourseByURL({ data: { url, method, body, response }, sendResponse }) {
        fetch(url, {
            method,
            body,
        })
            .then(res => (response === 'json' ? res.json() : res.text()))
            .then(sendResponse);
    },
};

async function checkCourseStatusChanges() {
    const activeIndex = await UserScheduleStore.get('activeIndex');
    const schedules = await UserScheduleStore.get('schedules');
    const currentSchedule = schedules[activeIndex]?.courses;
    

    if (!currentSchedule || currentSchedule.length === 0) return;

    let newStatus = currentSchedule[0]?.status;
    for (const course of currentSchedule) {
        // Get the latest status from the course catalog or API
        // You might need to import your CourseCatalogScraper here
        const uniqueId = course.uniqueId;
        // gets the new status
        try {
            const response = await fetch(`https://utdirect.utexas.edu/apps/registrar/course_schedule/20252/${uniqueId}/`);
            const html = await response.text();

            // Parse the HTML using DOMParser
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const scraper = new CourseCatalogScraper('COURSE_CATALOG_LIST', doc);
            const rows = Array.from(doc.querySelectorAll('tr'));

            for (const row of rows) {
                const id = scraper.getUniqueId(row);
                if (id === uniqueId) {
                    const scrapedStatus = scraper.getStatus(row)[0];
                    newStatus = scrapedStatus as StatusType;
                }
            }
            
            }
        catch (error) {
            console.error(`Failed to check status for course ${uniqueId}:`, error);
        }
        
        if (newStatus && newStatus !== currentSchedule[0]?.status) {
            const updatedCourses = currentSchedule.map(c => {
                if (c.uniqueId === uniqueId) {
                    return { ...c, status: newStatus } as Serialized<Course>; // Explicitly cast here
                }
                return c as Serialized<Course>; // Ensure the rest match expected type
            });
        
            const updatedSchedules = [...schedules];
            // updatedSchedules[activeIndex] = {
            //     ...updatedSchedules[activeIndex], 
            //     courses: updatedCourses,
            // };

        
            await UserScheduleStore.set('schedules', updatedSchedules);
        }
        

         // if (updatedCourseInfo && updatedCourseInfo.status !== course.status) {
            //     // Status has changed
            //     const updatedCourses = currentSchedule.map(c => 
            //         c.uniqueNumber === course.uniqueNumber 
            //             ? { ...c, status: updatedCourseInfo.status }
            //             : c
            //     );

            //     // Update the store with new course status
            //     const updatedSchedules = [...schedules];
            //     updatedSchedules[activeIndex] = {
            //         ...schedules[activeIndex],
            //         courses: updatedCourses
            //     };
                
            //     await UserScheduleStore.set('schedules', updatedSchedules);

            //     // Notify user of status change
            //     chrome.notifications.create({
            //         type: 'basic',
            //         title: 'Course Status Change',
            //         message: `${course.courseName} status changed from ${course.status} to ${updatedCourseInfo.status}`,
            //         iconUrl: '/icons/icon48.png'  // Make sure this path is correct
            //});
    }
}

// You'll need to implement this function to fetch the latest course status
async function fetchLatestCourseStatus(course: Course) {
    // Implement the logic to fetch the latest course status
    // This might involve using your CourseCatalogScraper or making an API call
    // Return the updated course information
    return null; // Replace with actual implementation
}




export default userScheduleHandler;
