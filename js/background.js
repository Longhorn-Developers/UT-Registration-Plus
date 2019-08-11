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

function updateBadge(first) {
    chrome.storage.sync.get('savedCourses', function (data) {
        if (data.savedCourses) {
            let text = "";
            if (data.savedCourses.length > 0) {
                text += data.savedCourses.length
            }
            chrome.browserAction.setBadgeText({
                text: text
            });
            let timeout = 0;
            if (!first) {
                chrome.browserAction.setBadgeBackgroundColor({
                    color: '#FF5722'
                });
                timeout = 200;
            }
            setTimeout(function () {
                chrome.browserAction.setBadgeBackgroundColor({
                    color: '#bf5700'
                });
            }, timeout);

        }
    });
}

/* Find all the conflicts in the courses and send them out/ if there is even a conflict*/
function checkConflicts(sendResponse) {
    chrome.storage.sync.get('savedCourses', function (data) {
        var conflicts = [];
        var courses = data.savedCourses;
        for (var i = 0; i < courses.length; i++) {
            for (var j = i + 1; j < courses.length; j++) {
                if (isConflict(courses[i].datetimearr, courses[j].datetimearr)) {
                    console.log("conflict");
                    conflicts.push([courses[i], courses[j]]);
                }
            }
        }
        if (conflicts.length == 0) {
            sendResponse({
                isConflict: false
            });
        } else {
            console.log(conflicts);
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
        for (var i = 0; i < courses.length; i++) {
            if (isConflict(currdatearr, courses[i].datetimearr)) {
                conflict = true;
                break;
            }
        }
        var contains = false;
        var i = 0;
        while (i < courses.length && !contains) {
            if (courses[i].unique == unique) {
                contains = true;
            }
            i++;
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
        var currday = adtarr[i][0];
        var currtimes = adtarr[i][1];
        for (var j = 0; j < bdtarr.length; j++) {
            var nextday = bdtarr[j][0];
            var nextimes = bdtarr[j][1];
            if (nextday == currday) {
                if (currtimes[0] < nextimes[1] && currtimes[1] > nextimes[0]) {
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
        updateBadge();
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
        updateBadge();
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
        if (courses[i].unique == unique) {
            return true;
        }
        i++;
    }
    return false;
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
        var nochange = true;
        for (let i = 0; i < courses.length; i++) {
            try {
                let c = courses[i];
                let oldstatus = c.status;
                let oldlink = c.link;
                $.ajax({
                    url: oldlink,
                    success: function (result) {
                        if (result) {
                            console.log(result);
                            var object = $('<div/>').html(result).contents();
                            let newstatus = object.find('[data-th="Status"]').text();
                            let registerlink = object.find('td[data-th="Add"] a');
                            if (registerlink)
                                registerlink = registerlink.attr('href');
                            var haschanged = (newstatus == oldstatus && registerlink == oldlink);
                            if (!haschanged)
                                console.log(c.unique + ' updated from ' + oldstatus + " to " + newstatus + " and " + oldlink + " to " + registerlink);
                            nochange &= haschanged;
                            c.registerlink = registerlink;
                            c.status = newstatus;
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                console.log('Not logged into UT Coursebook. Could not update class statuses.');
            }
        }
        if (!nochange) {
            chrome.storage.sync.set({
                savedCourses: courses
            });
            console.log('updated status');
        }
    });
}