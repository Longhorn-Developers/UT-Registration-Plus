var grades; // caching the grades database in memory for faster queries
var current_semesters = {};
var departments = [];
var should_open = false; // toggled flag for automatically opening popup on new pages when 'more info' hit
var semesters;
const default_options = {
    loadAll: true,
    courseConflictHighlight: true,
    storeWaitlist: true,
};


///ISSUES: 
//1. When adding/removing/importing courses there is a weird error. 
//   The function works perfectly but still logs an error (But not in the console) [if it works it works?]

onStartup();
async function onStartup() {

    try {
        importScripts("js/config.js");
        importScripts("js/util.js");  
        importScripts("js/lib/sql-memory-growth.js");
    } catch (e) {
        console.log(e);
    } //imports Colors from config.js

    updateBadge(true);
    
    await loadDataBase(); //Not working yet, see function notes

    getCurrentSemesters()
    getCurrentDepartments();
}


chrome.runtime.onMessage.addListener(function (request, sender, response) {
    console.log(request.command)
    switch (request.command) {
        case "help":
            console.log(request, sender, response)
            break;
        case "getData":
            loadDataBase();
            break;
        case "courseStorage":
            if (request.action == "add") {
                add(request, sender, response);
            }
            if (request.action == "remove") {
                remove(request, sender, response);
            }
            break;
        case "isSingleConflict":
            isSingleConflict(request.dtarr, request.unique, response);
            break;

        //below unchecked
        case "checkConflicts":
            checkConflicts(response);
            break;
        case "updateBadge":
            updateBadge();
            break;

        case "alreadyContains":
            alreadyContains(request.unique, response);
            break;
        case "updateCourseList":
            updateTabs();
            break;
        case "gradesQuery":
            executeQuery(request.query, response);
            break;
        //
        
        case "currentSemesters":
            getCurrentSemesters();
            response({ semesters: current_semesters });
            break;

        //below unchecked
        case "currentDepartments":
            getCurrentDepartments();
            response({ departments: departments });
            break;
        case "setOpen":
            should_open = true;
            chrome.tabs.create({ url: request.url });
            break;
        case "shouldOpen":
            response({ open: should_open });
            should_open = false;
            break;

        case "getOptionsValue":
            getOptionsValue(request.key, response);
            break;

        case "setOptionsValue":
            setOptionsValue(request.key, request.value, response);
            break;
        
        default: 
            //TODO: this wont work because of xhr being outdated; what should go here??
            const xhr = new XMLHttpRequest();
            const method = request.method ? request.method.toUpperCase() : "GET";
            xhr.open(method, request.url, true);
            console.log(request);
            xhr.onload = () => {
                console.log(xhr.responseUrl);
                response(xhr.responseText);
            };
            xhr.onerror = () => response(xhr.statusText);
            if (method == "POST") {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            }
            xhr.send(request.data);
            break;
    }
    return true;
});

/* Initially set the course data in storage */
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        setDefaultOptions();
        chrome.storage.sync.get("savedCourses", function (data) {
            if (!data.savedCourses) {
                chrome.storage.sync.set({
                    savedCourses: [],
                });
            }
        });
    } else if (details.reason == "update") {
        // if there's been an update, call setDefaultOptions in case their settings have gotten wiped
        setDefaultOptions();
        console.log("updated");
    }
});

chrome.storage.onChanged.addListener(function (changes) {
    for (key in changes) {
        if (key === "savedCourses") {
            updateBadge(false, changes.savedCourses.newValue); // update the extension popup badge whenever the savedCourses have been changed
        }
    }
});

function getOptionsValue(key, sendResponse) {
    chrome.storage.sync.get("options", function (data) {
        if (!data.options) {
            setDefaultOptions();
        } else {
            sendResponse({
                value: data.options[key],
            });
        }
    });
}

function setOptionsValue(key, value, sendResponse) {
    chrome.storage.sync.get("options", function (data) {
        let new_options = data.options;
        if (!data.options) {
            // if there are no options set, set the defaults
            setDefaultOptions();
            new_options = default_options;
        }
        new_options[key] = value;
        chrome.storage.sync.set(
            {
                options: new_options,
            },
            function () {
                sendResponse({
                    value: new_options[key],
                });
            }
        );
    });
}

function setDefaultOptions() {
    chrome.storage.sync.get("options", function (data) {
        if (!data.options) {
            chrome.storage.sync.set(
                {
                    options: default_options,
                },
                function () {
                    console.log("default options:", default_options);
                }
            );
        }
    });
}

async function getCurrentSemesters() {
    let webData;
    if(Object.keys(current_semesters).length > 0) {
        chrome.storage.local.set({
            semesterCache: current_semesters
        });
    }
    async function goFetch(linkend="") {
        return fetch("https://registrar.utexas.edu/schedules/" + linkend)
        .then((response) => { 
            return response.text()
            .then((data) => {
                return data;
            }).catch((err) => {
                console.log(err);
            }) 
        }); 
    }

    await goFetch().then((data) => {webData = data});
    let arr = webData.split("\n");
    let i = 0
    for(let row=0; row<arr.length; row++) {
        if(arr[row].startsWith('<li><a href="https://registrar.utexas.edu/schedules/') && arr[row][52] != "a") {
            let newWebData;
            let start = arr[row].indexOf('Schedule">')+10;
            let end = arr[row].indexOf('</a></li>');
            let name = arr[row].substring(start,end);

            let num = arr[row].indexOf('"https://registrar.utexas.edu/schedules/">')+53;
            let numend = arr[row].indexOf('" target');
            let short_sem_num = arr[row].substring(num,numend);
            current_semesters[name] = "code";

            await goFetch(short_sem_num).then((data) => {newWebData = data});
            arr2 = newWebData.split("\n")

            for(let row2=0; row2<arr2.length; row2++) {
                if(arr2[row2].startsWith('<div class="gobutton"><a href="')) {
                    let start2 = arr2[row2].indexOf('<div class="gobutton"><a href="')+31;
                    let end2 = arr2[row2].indexOf('" target="');
                    var scheduleLink = arr2[row2].substring(start2,end2);
                    var sem_num = scheduleLink.substring(scheduleLink.lastIndexOf("/") + 1).trim();
                    if (current_semesters[name] != sem_num) {
                        current_semesters[name] = sem_num;
                    }
                    break;
                }
            }
            i+=1
        }
        if(i > Popup.num_semesters) {
            break;
        }
    }
}

async function getCurrentDepartments() {
    if(departments.length > 0) {
        chrome.storage.local.set({
            deptCache: departments
        });
    }
    async function goFetch() {
        return fetch("https://raw.githubusercontent.com/sghsri/UT-Registration-Plus/master/docs/departments.json")
        .then((response) => { 
            return response.text()
            .then((data) => {
                return data;
            }).catch((err) => {
                console.log(err);
            }) 
        }); 
    }

    await goFetch().then((data) => {departments = JSON.parse(data)});
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

function checkConflicts(sendResponse) {
    chrome.storage.sync.get("savedCourses", function (data) {
        var conflicts = [];
        var courses = data.savedCourses;
        for (let i = 0; i < courses.length; i++) {
            for (let j = i + 1; j < courses.length; j++) {
                let course_a = courses[i];
                let course_b = courses[j];
                if (isConflict(course_a.datetimearr, course_b.datetimearr)) conflicts.push([course_a, course_b]);
            }
        }
        sendResponse({
            isConflict: conflicts.length !== 0,
            between: conflicts.length ? conflicts : undefined,
        });
    });
}

function isSingleConflict(currdatearr, unique, sendResponse) {
    chrome.storage.sync.get("savedCourses", function (data) {
        var courses = data.savedCourses;
        var conflict_list = [];
        var conflict = false;
        var contains = false;
        for (let i = 0; i < courses.length; i++) {
            let course = courses[i];
            if (isConflict(currdatearr, course.datetimearr)) {
                conflict = true;
                conflict_list.push(course);
            }
            if (!contains && isSameCourse(course, unique)) {
                contains = true;
            }
        }
        sendResponse({
            isConflict: conflict,
            alreadyContains: contains,
            conflictList: conflict_list,
        });
    });
}

/* Check if conflict between two date-time-arrs*/
function isConflict(adtarr, bdtarr) {
    for (var i = 0; i < adtarr.length; i++) {
        var current_day = adtarr[i][0];
        var current_times = adtarr[i][1];
        for (var j = 0; j < bdtarr.length; j++) {
            var next_day = bdtarr[j][0];
            var next_times = bdtarr[j][1];
            if (next_day == current_day) {
                if (current_times[0] < next_times[1] && current_times[1] > next_times[0]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function setDefaultOptions() {
    chrome.storage.sync.get("options", function (data) {
        if (!data.options) {
            chrome.storage.sync.set(
                {
                    options: default_options,
                },
                function () {
                    console.log("default options:", default_options);
                }
            );
        }
    });
}

/* Add the requested course to the storage*/
function add(request, sender, sendResponse) {
    chrome.storage.sync.get("savedCourses", function (data) {
        var courses = data.savedCourses;
        if (!contains(courses, request.course.unique)) {
            courses.push(request.course);
            console.log(courses);
            chrome.storage.sync.set({
                savedCourses: courses,
            });
        }
        sendResponse({
            done: "Added: (" + request.course.unique + ") " + request.course.coursename,
            label: "Remove Course -",
            value: "remove",
        });
    });
}
/* Find and Remove the requested course from the storage*/
function remove(request, sender, sendResponse) {
    chrome.storage.sync.get("savedCourses", function (data) {
        var courses = data.savedCourses;
        console.log(courses);
        var index = 0;
        while (index < courses.length && courses[index].unique != request.course.unique) {
            index++;
        }
        courses.splice(index, 1);
        chrome.storage.sync.set({
            savedCourses: courses,
        });
        sendResponse({
            done: "Removed: (" + request.course.unique + ") " + request.course.coursename,
            label: "Add Course +",
            value: "add",
        });
    });
}

function alreadyContains(unique, sendResponse) {
    chrome.storage.sync.get("savedCourses", function (data) {
        var courses = data.savedCourses;
        sendResponse({
            alreadyContains: contains(courses, unique),
        });
    });
}

// find if a course with the current unique number exists in the user's saved courses
function contains(courses, unique) {
    var i = 0;
    while (i < courses.length) {
        if (isSameCourse(courses[i], unique)) {
            return true;
        }
        i++;
    }
    return false;
}

// does it have the same unique number as provided
function isSameCourse(course, unique) {
    return course.unique == unique;
}

function updateTabs() {
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, {
                command: "updateCourseList",
            });
        }
    });
}

function executeQuery(query, sendResponse) {
    //var res = "1"; //TEMPORARY
    var res = grades.exec(query)[0]; //why this no work
    sendResponse({
        data: res,
    });
}


////Currently not working: XMLHttpRequest is outdated. Find a way to post to web sql (or other source, mongodb?) using fetch

/* Load the database*/
async function loadDataBase() {
    var tgrades;
    async function goFetch() {
        return fetch("grades.db")
        .then((response) => { 
            return response.arrayBuffer()
            .then((data) => {
                return data;
            }).catch((err) => {
                console.log(err);
            }) 
        }); 
    }

    await goFetch().then((data) => {tgrades=data});
    var data2 = new Uint8Array(tgrades);
    var arr = new Array();
    for (var i = 0; i != data2.length; ++i) arr[i] = String.fromCharCode(data2[i]);
    var sqldb = new SQL.Database(arr.join(""));
    grades = sqldb;
}