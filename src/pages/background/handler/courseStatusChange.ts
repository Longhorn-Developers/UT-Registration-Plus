import { UserScheduleStore } from "src/shared/storage/UserScheduleStore";
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import { Course, StatusType } from '@shared/types/Course'; 
import { resolve } from "path";


export default async function checkCourseStatusChanges() {
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
        // console.log(uniqueId, 'UNIQUE ID');
        try {
            const response = await fetch(`https://utdirect.utexas.edu/apps/registrar/course_schedule/20252/${uniqueId}/`);
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const scraper = new CourseCatalogScraper('COURSE_CATALOG_LIST', doc);
            const rows = doc.querySelectorAll('tr');
            rows.forEach(row => {
                try {
                    const id = scraper.getUniqueId(row);
                    if (id && id === uniqueId) {
                        const scrapedStatus = scraper.getStatus(row)[0];
                        newStatus = scrapedStatus as StatusType;
                    }
                    console.log('Unique ID:', uniqueId);
                } catch (error) {
                    console.error(error);
                }
            });
            
        }
        catch (error) {
            console.error(`Failed to check status for course ${uniqueId}:`, error);
        }
        
        if (newStatus && newStatus !== currentSchedule[0]?.status) {
            const updatedCourses = currentSchedule.map(c => {
                if (c.uniqueId === uniqueId) {
                    return { ...c, status: newStatus } as Course; 
                }
                return c as Course; 
            });
            console.log(updatedCourses);
            const updatedSchedules = [...schedules];
            console.log("UPDATED", updatedSchedules)
            {
                ...updatedSchedules[activeIndex], 
                courses: updatedCourses,
            };

        
            await UserScheduleStore.set('schedules', updatedSchedules);
        }
    }
}