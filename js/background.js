/* Handle messages and their commands from content and popup scripts*/
chrome.runtime.onMessage.addListener(function (request, sender, response) {
	if (request.command == "courseStorage") {
		if (request.action == "add") {
			add(request, sender, response);
		}
		if (request.action == "remove") {
			remove(request, sender, response);
		}
	} else if (request.command == "isSingleConflict") {
		isSingleConflict(request.dtarr, request.unique, response);
	} else if (request.command == "checkConflicts") {
		checkConflicts(response);
	} else if (request.command == "updateStatus") {
		updateStatus();
	} else if (request.command == "alreadyContains") {
		alreadyContains(request.unique, response);
	} else if (request.command == "updateTabs") {
		updateTabs();
	} else if(request.command == "updateCourseList"){
		chrome.tabs.query({}, function (tabs) {
			for (var i = 0; i < tabs.length; i++) {
				chrome.tabs.sendMessage(tabs[i].id, {
					command: "updateCourseList"
				});
			}
		});
	} else {
		const xhr = new XMLHttpRequest();
		const method = request.method ? request.method.toUpperCase() : "GET";
		xhr.open(method, request.url, true);
		xhr.onload = () => response(xhr.responseText);
		xhr.onerror = () => response(xhr.statusText);
		if (method == "POST") {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		xhr.send(request.data);
	}
	return true;
});

/* Initially set the course data in storage */
chrome.runtime.onInstalled.addListener(function (details) {
	if (details.reason == "install" || details.reason == "update") {
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
	}
});

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

setInterval(updateStatus, 2000);

function updateStatus() {
	chrome.storage.sync.get('savedCourses', function (data) {
		var courses = data.savedCourses;
		for (let i = 0; i < courses.length; i++) {
			let c = courses[i];
			var xhr = new XMLHttpRequest();
			xhr.open("GET", c.link, false);
			xhr.send();
			let result = xhr.responseText;
			let dummy = document.createElement('html');
			dummy.innerHTML = result;
			let newstatus = dummy.querySelector('[data-th="Status"]').textContent;
			let registerlink = dummy.querySelector('td[data-th="Add"] a');
			if(registerlink){
				registerlink = registerlink.getAttribute('href');
			}
			c.registerlink = registerlink;
			c.status = newstatus;
		}
		chrome.storage.sync.set({
			savedCourses: courses
		});
		console.log("updated status' and registerlinks");
	});
}