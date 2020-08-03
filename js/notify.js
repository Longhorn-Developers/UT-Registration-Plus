var course_schedule = {};

function catalogScrape() {
	chrome.storage.sync.get('notifications', function(data) {
		let course_name = "";
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
		notifications = data.notifications;
		notifications.forEach(course => delete course_schedule[course.unique]);
		pushScheduleData();
	});
}

function displayTime(unformattedTime) {
	let formattedTime = "";
	for (i = 0; i < unformattedTime.days.length; i++) {
		formattedTime += unformattedTime.days[i] + ": " + unformattedTime.times[i] + "\n"
	}
	return formattedTime.slice(0, -1);
}

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
		"status": $(row).find('td[data-th="Status"]').text(),
	}
	course_schedule[course.id] = course;
}

function pushScheduleData(){
	fetch(Schedule.db_push_hook, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(course_schedule)
	});
}

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
		signUpForNotifs(c.unique);
	});
}

function signUpForNotifs(unique) {
	let signUp = {};
	chrome.storage.sync.get('contactInfo', function (data) {
        if (data.contactInfo) {
			signUp[unique] = {
				"email": data.contactInfo.email,
				"phone": data.contactInfo.phone
			}
			fetch(Notification.db_push_hook, {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(signUp)
			});
        }
    });
}
