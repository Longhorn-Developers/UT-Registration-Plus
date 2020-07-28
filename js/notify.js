var course_schedule = [];

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
				course_row = $(this);
				extractCourseData($(this), course_name);
			}
		})
	}
}

function extractCourseData(row, course_name) {
	course_name = course_name.trim().split('\n').filter(part => part.trim() != '').map(part => part.trim()).join(' ');
	let unique_num = $(row).find('td[data-th="Unique"]').text();
	let class_name = course_name;
	let professor = $(row).find('td[data-th="Instructor"]').text();
	let status = $(row).find('td[data-th="Status"]').text();

	course_schedule.push({
		"record": {
			"id": unique_num,
			"class": class_name,
			"professor": professor,
			"status": status
		}
	});
}

function pushScheduleData(course_schedule){
	console.log("start");
	fetch(Schedule.db_push_hook, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(course_schedule)
	  });
}
