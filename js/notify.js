//Associate unique id's with course catalog info in dictionary to push to DB and for quick lookup
var course_schedule = {};

//Course schedule web scrape pushing fields to DB
function catalogScrape() {
	//Check if user has allowed for web scrape in settings
	chrome.runtime.sendMessage({
		command: "getOptionsValue",
		key: "readCourseSchedule",
	}, function (response) {
		if (response.value) {
			//Determine if individual course page or on full catalog and scrape/store accordingly
			chrome.storage.sync.get('notifications', function(data) {
				let course_name = "";
				notifications = data.notifications;
				if (isIndividualCoursePage()) {
					course_name = $("#details h2").text();
					extractCourseData($('table'), course_name);
				} else {
					$('table').find('tr').each(function () {
						if ($(this).find('td').hasClass("course_header")) {
							course_name = $(this).find('td').text() + "";
						}
						else if (course_name) {
							extractCourseData($(this), course_name);
						}
					})
				}
				//If course on notification list prevent pushing to DB (allows fairness to students who see course update first on catalog), else push to DB
				notifications.forEach(course => delete course_schedule[course.unique]);
				pushScheduleData();
			});
		}
	});
}

//Format course time field for DB
function displayTime(unformattedTime) {
	let formattedTime = "";
	for (i = 0; i < unformattedTime.days.length; i++) {
		formattedTime += unformattedTime.days[i] + ": " + unformattedTime.times[i] + "\n"
	}
	return formattedTime.slice(0, -1);
}

//Build course object to store in course_schedule dictionary (unique:{course obj}).
function extractCourseData(row, course_name) {
	let course = {
		"id": $(row).find('td[data-th="Unique"]').text(),
		"class": course_name.replace(/\s\s+/g, ' ').trim(),
		"description": $(row).find('td[data-th="Unique"] a').prop('href'),
		"professor": $(row).find('td[data-th="Instructor"]').text(),
		"time": displayTime({
			"days": $(row).find('td[data-th="Days"]>span').toArray().map(x => $(x).text().trim()),
			"times": $(row).find('td[data-th="Hour"]>span').toArray().map(x => $(x).text().trim())
		}),
		"register": $(row).find('td[data-th="Add"] a').prop('href'),
		"status": $(row).find('td[data-th="Status"]').text().toUpperCase(),
	}
	course_schedule[course.id] = course;
}

//POST course schedule to DB
function pushScheduleData(){
	fetch(Schedule.db_push_hook, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(course_schedule)
	});
}

//Call when a user interacts with a course from the course schedule; grab the info for the current course they selected, and sendMessage to background to check if it's a subscribe or unsubscribe action -> handle accordingly with DB and local storage
function trackCourse() {
	let {
		full_name,
		unique,
		prof_name,
		status,
		individual,
		register
	} = curr_course;
	let dtarr = getDayTimeArray(undefined, curr_course);
	let c = new Course(full_name, unique, prof_name, dtarr, status, individual, register);
	chrome.runtime.sendMessage({
		command: "courseNotification",
		course: c,
		action: $("#notifyMe").val()
	}, function (response) {
		$("#notifyMe").text(response.label);
		$("#notifyMe").val(response.value);
		$("#snackbar").text(response.done);
		toggleSnackbar();
	});
}
