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

    getCurrentSemesters().then((data) => {semesters = data});
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

async function getCurrentSemesters() {

    let webData;

    async function goFetch() {
        return fetch("https://registrar.utexas.edu/schedules")
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
            let start = arr[row].indexOf('Schedule">')+10;
            let end = arr[row].indexOf('</a></li>')
            console.log(arr[row].substring(start,end));
            i+=1
        }
        if(i > Popup.num_semesters) {
            break;
        }
    }
    

}

function oldGetCurrentSemesters() {
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