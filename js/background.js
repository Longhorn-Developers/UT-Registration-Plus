updateBadge(true);
var grades;
loadDataBase()
/* Handle messages and their commands from content and popup scripts*/
chrome.runtime.onMessage.addListener(function (request, sender, response) {
    switch (request.command) {
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
        case "checkConflicts":
            checkConflicts(response);
            break;
        case "updateBadge":
            updateBadge();
            break;
        case "updateStatus":
            updateStatus(response);
            break;
        case "alreadyContains":
            alreadyContains(request.unique, response);
            break;
        case "updateCourseList":
            updateTabs();
            break;
        case "gradesQuery":
            executeQuery(request.query, response);
        default:
            const xhr = new XMLHttpRequest();
            const method = request.method ? request.method.toUpperCase() : "GET";
            xhr.open(method, request.url, true);
            console.log(request);
            xhr.onload = () => {
                console.log(xhr.responseUrl);
                response(xhr.responseText);
            }
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
        chrome.storage.sync.get('savedCourses', function (data) {
            if (!data.savedCourses) {
                var arr = new Array();
                chrome.storage.sync.set({
                    savedCourses: arr
                }, function () {
                    console.log('initial course list');
                });
                chrome.storage.sync.set({
                    courseConflictHighlight: true
                }, function () {
                    console.log('initial highlighting: true');
                });
                chrome.storage.sync.set({
                    loadAll: true
                }, function () {
                    console.log('initial loadAll: true');
                });
            }
        });
    } else if (details.reason == "update") {
        console.log("updated");
        chrome.storage.sync.get('loadAll', function (data) {
            if (data.loadAll == undefined) {
                chrome.storage.sync.set({
                    loadAll: true
                }, function () {
                    console.log('initial loadAll: true');
                });
            }
        });
    }
});


chrome.storage.onChanged.addListener(function (changes) {
    for (key in changes) {
        console.log(changes);
        if (key === 'savedCourses') {
            updateBadge(false, changes.savedCourses.newValue);
        }
    }
});


function executeQuery(query, sendResponse) {
    console.log(grades)
    var res = grades.exec(query)[0];
    sendResponse({
        data: res,
    });
}

/* Load the database*/
function loadDataBase() {
    sql = window.SQL;
    loadBinaryFile('grades.db', function (data) {
        var sqldb = new SQL.Database(data);
        grades = sqldb;
    });
}
/* load the database from file */
function loadBinaryFile(path, success) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL(path), true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        var data = new Uint8Array(xhr.response);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        success(arr.join(""));
    };
    xhr.send();
};

function updateBadge(first, new_changes) {
    if (new_changes) {
        updateBadgeText(first, new_changes);
    } else {
        chrome.storage.sync.get('savedCourses', function (data) {
            let courses = data.savedCourses;
            updateBadgeText(first, courses);
        });
    }
}


function updateBadgeText(first, courses) {
    let badge_text = courses.length > 0 ? `${courses.length}` : "";
    let flash_time = !first ? 200 : 0;
    chrome.browserAction.setBadgeText({
        text: badge_text
    });
    if (!first) {
        chrome.browserAction.setBadgeBackgroundColor({
            color: Colors.badge_flash
        });
    }
    setTimeout(function () {
        chrome.browserAction.setBadgeBackgroundColor({
            color: Colors.badge_default
        });
    }, flash_time);
}

/* Find all the conflicts in the courses and send them out/ if there is even a conflict*/
function checkConflicts(sendResponse) {
    chrome.storage.sync.get('savedCourses', function (data) {
        var conflicts = [];
        var courses = data.savedCourses;
        for (let i = 0; i < courses.length; i++) {
            for (let j = i + 1; j < courses.length; j++) {
                let course_a = courses[i];
                let course_b = courses[j];
                if (isConflict(course_a.datetimearr, course_b.datetimearr))
                    conflicts.push([course_a, course_b]);
            }
        }
        if (conflicts.length == 0) {
            sendResponse({
                isConflict: false
            });
        } else {
            sendResponse({
                isConflict: true,
                between: conflicts
            });
        }
    });
}

/* Find if the course at unique and with currdatearr is contained in the saved courses and if it conflicts with any other courses*/
function isSingleConflict(currdatearr, unique, sendResponse) {
    chrome.storage.sync.get('savedCourses', function (data) {
        var courses = data.savedCourses;
        var conflict = false;
        var contains = false;
        for (let i = 0; i < courses.length; i++) {
            let course = courses[i];
            if (!conflict && isConflict(currdatearr, course.datetimearr)) {
                conflict = true;
            }
            if (!contains && isSameCourse(course, unique)) {
                contains = true;
            }
        }
        sendResponse({
            isConflict: conflict,
            alreadyContains: contains
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

/* Add the requested course to the storage*/
function add(request, sender, sendResponse) {
    chrome.storage.sync.get('savedCourses', function (data) {
        var courses = data.savedCourses;
        if (!contains(courses, request.course.unique)) {
            courses.push(request.course)
            console.log(courses);
            chrome.storage.sync.set({
                savedCourses: courses
            });
        }
        sendResponse({
            done: "Added: (" + request.course.unique + ") " + request.course.coursename,
            label: "Remove Course -"
        });
    });
}
/* Find and Remove the requested course from the storage*/
function remove(request, sender, sendResponse) {
    chrome.storage.sync.get('savedCourses', function (data) {
        var courses = data.savedCourses;
        console.log(courses);
        var index = 0;
        while (index < courses.length && courses[index].unique != request.course.unique) {
            index++;
        }
        courses.splice(index, 1);
        chrome.storage.sync.set({
            savedCourses: courses
        });
        sendResponse({
            done: "Removed: (" + request.course.unique + ") " + request.course.coursename,
            label: "Add Course +"
        });
    });
}

/* Find if the unique is already contained within the storage*/
function alreadyContains(unique, sendResponse) {
    chrome.storage.sync.get('savedCourses', function (data) {
        var courses = data.savedCourses;
        sendResponse({
            alreadyContains: contains(courses, unique)
        });
    });
}

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

function isSameCourse(course, unique) {
    return course.unique == unique
}

function updateTabs() {
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, {
                command: "updateCourseList"
            });
        }
    });
}

const UPDATE_INTERVAL = 1000 * 60 * 16;
setInterval(updateStatus, UPDATE_INTERVAL);
// updateStatus();


function updateStatus(sendResponse) {
    chrome.storage.sync.get('savedCourses', function (data) {
        var courses = data.savedCourses;
        var no_change = true;
        for (let i = 0; i < courses.length; i++) {
            try {
                let c = courses[i];
                let old_status = c.status;
                let old_link = c.link;
                $.ajax({
                    url: old_link,
                    success: function (result) {
                        if (result) {
                            console.log(result);
                            var object = $('<div/>').html(result).contents();
                            let new_status = object.find('[data-th="Status"]').text();
                            let register_link = object.find('td[data-th="Add"] a');
                            if (register_link)
                                register_link = register_link.attr('href');
                            var haschanged = (new_status == old_status && register_link == old_link);
                            if (!haschanged)
                                console.log(c.unique + ' updated from ' + old_status + " to " + new_status + " and " + old_link + " to " + register_link);
                            no_change &= haschanged;
                            c.registerlink = register_link;
                            c.status = new_status;
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                console.log('Not logged into UT Coursebook. Could not update class statuses.');
            }
        }
        if (!no_change) {
            chrome.storage.sync.set({
                savedCourses: courses
            });
            console.log('updated status');
        }
    });
}