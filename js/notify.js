var course_schedule = {};

function catalogScrape() {
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
}

function extractCourseData(row, course_name) {
	let unique_num = $(row).find('td[data-th="Unique"]').text();
	let class_name = course_name.trim().split('\n').filter(part => part.trim() != '').map(part => part.trim()).join(' ');
	let professor = $(row).find('td[data-th="Instructor"]').text();
	let status = $(row).find('td[data-th="Status"]').text();

	let course = {
		"id": unique_num,
		"class": class_name,
		"professor": professor,
		"status": status
	};
	course_schedule[unique_num] = course;
}

function pushScheduleData(course_schedule){
	fetch(Schedule.db_push_hook, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(course_schedule)
	  });
}

function trackCourse() {
	course = course_schedule[curr_course.unique];
	chrome.runtime.sendMessage({
		command: "courseNotify",
		course: course,
		action: $("#notifyMe").val()
	}, function (response) {
		$("#notifyMe").text(response.label);
		$("#notifyMe").val(response.value);
		$("#snackbar").text(response.done);
		toggleSnackbar();
	});
}
