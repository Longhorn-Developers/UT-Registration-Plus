var grades; // caching the grades database in memory for faster queries
var current_semesters = {};
var departments = [];
var should_open = false; // toggled flag for automatically opening popup on new pages when 'more info' hit
var semesters
const default_options = {
    loadAll: true,
    courseConflictHighlight: true,
    storeWaitlist: true,
};

///ISSUES: on startup after inactive, have to click off and back on to reload data. How to circumvent?

onStartup();
function onStartup() {
    console.log('start');

    try {
        importScripts("js/config.js");
        importScripts("js/util.js");  
    } catch (e) {
        console.log(e);
    } //imports Colors from config.js

    updateBadge(true);
    
    //loadDataBase(); Not workling yet, see function notes

    getCurrentSemesters()

    //getCurrentDepartments();

    console.log('end')
}


chrome.runtime.onMessage.addListener(function (request, sender, response) {
    console.log(request.command)
    switch (request.command) {
        case "courseStorage":
            if (request.action == "add") {
                add(request, sender, response);
            }
            if (request.action == "remove") {
                remove(request, sender, response);
            }
            break;
        case "currentSemesters":
            response({ semesters: current_semesters });
            getCurrentSemesters();
            break;
    }
    return true;
});



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

            //console.log(name + " " + short_sem_num); //important

            current_semesters[name] = "code";

            await goFetch(short_sem_num).then((data) => {newWebData = data});
            arr2 = newWebData.split("\n")
            //console.log(arr2)

            for(let row2=0; row2<arr2.length; row2++) {
                //console.log(arr2[row2])
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
            //console.log(scheduleLink + " " + sem_num) //important

            i+=1
        }
        if(i > Popup.num_semesters) {
            break;
        }
    }
    //console.log(current_semesters)
}

function old_GetCurrentSemesters() { //depricated: remove when finished
    $.get("https://registrar.utexas.edu/schedules", function (response) {
        console.log(response)
        if (response) {
            htmlToNode(response)
                .find(".callout2>ul>li>a")
                .each(function (i) {
                    // only show as many semesters as we want to display
                    if (i < Popup.num_semesters) {
                        let sem_name = $(this).text().trim();
                        if (sem_name != "Course Schedule Archive") {
                            // $("#semesters").append(`<option>${sem_name}</option>`);
                            current_semesters[sem_name] = "code";
                            $.get($(this).attr("href"), function (response) {
                                if (response) {
                                    let response_node = htmlToNode(response);
                                    let name = response_node.find(".page-title").text().substring(17).trim();
                                    response_node.find(".gobutton>a").each(function () {
                                        let link = $(this).attr("href");
                                        var sem_num = link.substring(link.lastIndexOf("/") + 1).trim();
                                        if (current_semesters[name] != sem_num) {
                                            current_semesters[name] = sem_num;
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
        }
    });
}

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



////Currently not working: XMLHttpRequest is outdated. Find a way to post to web sql (or other source, mongodb?) using fetch

// /* Load the database*/
// function loadDataBase() {
//     //sql = window.SQL;
//     loadBinaryFile("grades.db", function (data) {
//         var sqldb = new SQL.Database(data);
//         grades = sqldb;
//     });
    
// }
// /* load the database from file */
// function loadBinaryFile(path, success) {
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", chrome.runtime.getURL(path), true);
//     xhr.responseType = "arraybuffer";
//     xhr.onload = function () {
//         var data = new Uint8Array(xhr.response);
//         var arr = new Array();
//         for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
//         success(arr.join(""));
//     };
//     xhr.send();

//     fetch(chrome.runtime.getURL(path))
//     .then((response) => response.json())
// }