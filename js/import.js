var waitlist;
var sem;
$(function () {
	waitlist = !(window.location.href.includes('https://utdirect.utexas.edu/registration/classlist.WBX'));
	sem = waitlist ? $('[name="s_ccyys"]').val() : $("option[selected='selected']").val();
	if (waitlist) {
		$("[href='#top']").before(Template.Import.import_button());
		$("[name='wl_see_my_waitlists']").after(Template.Import.waitlist_import_button());
	} else
		$("table").after(Template.Import.import_button());
	$("#import").prepend("<div id='snackbar'>import snackbar..</div>");

	$("#import").click(function () {
		search_nodes = waitlist ? $(".tbg").last().find(".tbon>td:first-child") : $("tr>td:first-child");
		$(search_nodes).each(function () {
			importCourse($(this));
		})
		importButtonAnimation($(this));
	});

	$("#import_waitlist").click(function () {
		search_nodes = $("tr.tb span:first-child");
		$(search_nodes).each(function () {
			importCourse($(this));
		})
		importButtonAnimation($(this));
	});
});


function importButtonAnimation(button) {
	let is_waitlisted_button = $(button).attr('id') == "import_waitlist";
	let return_text = is_waitlisted_button ? Template.Import.waitlist_button_text_default : Template.Import.button_text_default;
	$(button).text(Template.Import.button_success).css("background-color", Colors.open);
	setTimeout(function () {
		$(button).html(return_text).css('background-color', Colors.waitlisted);
	}, 1000);
}

function importCourse(unique_node) {
	let unique = $(unique_node).text().replace(/\s/g, '');
	link = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${sem}/${unique}/`;
	buildAddCourse(link);
}


function buildAddCourse(link) {
	$.get(link, function (response) {
		if (response) {
			let simp_course = buildSimplifiedCourseObject(response, link);
			chrome.runtime.sendMessage({
				command: "courseStorage",
				course: simp_course,
				action: "add"
			}, function () {
				chrome.runtime.sendMessage({
					command: "updateCourseList"
				});
			});
		}
	})
}


function buildSimplifiedCourseObject(response, link) {
	let imported_course = getCourseObject(htmlToNode(response), link);
	let {
		full_name,
		unique,
		prof_name,
		individual,
		status,
		register
	} = curr_course;
	let dtarr = getDayTimeArray(undefined, curr_course);

	return new Course(full_name, unique, prof_name, dtarr, status, individual, register);
}

/*For a row, get all the course information and add the date-time-lines*/
function getCourseObject(response_node, individual) {
	let course_name = $(response_node).find("#details h2").text();
	let course_row = $(response_node).find('table');
	curr_course = buildBasicCourseInfo(course_row, course_name, individual);
}


function buildBasicCourseInfo(row, course_name, individual) {
	let {
		name,
		department,
		number
	} = seperateCourseNameParts(course_name);
	let instructor_text = $(row).find('td[data-th="Instructor"]').text();
	let has_initial = instructor_text.indexOf(',') > 0;
	course_info = {
		"full_name": course_name,
		"name": name,
		"department": department,
		"number": number,
		"individual": individual ? individual : $(row).find('td[data-th="Unique"] a').prop('href'),
		"register": $(row).find('td[data-th="Add"] a').prop('href'),
		"unique": $(row).find('td[data-th="Unique"]').text(),
		"status": $(row).find('td[data-th="Status"]').text(),
		"prof_name": instructor_text ? has_initial ? capitalizeString(instructor_text.split(', ')[0]) : capitalizeString(instructor_text) : "Undecided",
		"initial": instructor_text && has_initial ? instructor_text.split(', ')[1].substring(0, 1) : "",
		"time_data": {
			"days": $(row).find('td[data-th="Days"]>span').toArray().map(x => $(x).text().trim()),
			"times": $(row).find('td[data-th="Hour"]>span').toArray().map(x => $(x).text().trim()),
			"places": $(row).find('td[data-th="Room"]>span').toArray().map(x => $(x).text().trim())
		},
		"links": {}
	}
	return course_info;
}

/* For a row, get the date-time-array for checking conflicts*/
function getDayTimeArray(row, course_info) {
	var day_time_array = []
	let days = course_info ? course_info["time_data"]["days"] : $(row).find('td[data-th="Days"]>span').toArray().map(x => $(x).text().trim());
	let times = course_info ? course_info["time_data"]["times"] : $(row).find('td[data-th="Hour"]>span').toArray().map(x => $(x).text().trim());
	let places = course_info ? course_info["time_data"]["places"] : $(row).find('td[data-th="Room"]>span').toArray().map(x => $(x).text().trim());
	for (var i = 0; i < days.length; i++) {
		let date = days[i];
		let time = times[i];
		let place = places[i];
		for (var j = 0; j < date.length; j++) {
			let letter = date.charAt(j);
			if (letter == "T" && j < date.length - 1 && date.charAt(j + 1) == "H") {
				day_time_array.push(["TH", convertTime(time), place]);
			} else {
				if (letter != "H")
					day_time_array.push([letter, convertTime(time), place]);
			}
		}
	}
	return day_time_array;
}