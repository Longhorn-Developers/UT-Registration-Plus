var grades; // caching the grades database in memory for faster queries
var current_semesters = {};
var departments = [];
var should_open = false; // toggled flag for automatically opening popup on new pages when 'more info' hit
const default_options = {
    loadAll: true,
    courseConflictHighlight: true,
    storeWaitlist: true,
};

onStartup();
function onStartup() {
    console.log('start');

    try {
        importScripts("js/config.js");
    } catch (e) {
        console.log(e);
    } //import Colors from config.js

    updateBadge(true);
    

    console.log('end');
}


// update the badge text to reflect the new changes
function updateBadge(first, new_changes) {
    if (new_changes) {
        updateBadgeText(first, new_changes);
    } else {
        chrome.storage.sync.get("savedCourses", function (data) {
            let courses = data.savedCourses;
            updateBadgeText(first, courses);
        });
    }
}

// update the badge text to show the number of courses that have been saved by the user
function updateBadgeText(first, courses) {
    let badge_text = courses.length > 0 ? `${courses.length}` : "";
    let flash_time = !first ? 200 : 0;
    chrome.action.setBadgeText({
        text: badge_text,
    });
    if (!first) {
        // if isn't the first install of the extension, flash the badge to bring attention to it
        chrome.action.setBadgeBackgroundColor({
            color: Colors.badge_flash
            //color: '#33FF33'
        });
    }
    setTimeout(function () {
        chrome.action.setBadgeBackgroundColor({
            color: Colors.badge_default
            //color: '#33FF33'
        });
    }, flash_time);
}