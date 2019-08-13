var courses;

setCourseList();
getSemesters();
var can_remove = true;


function setCourseList() {
	$("#courseList").empty()
	chrome.storage.sync.get('savedCourses', function (data) {
		updateConflicts();
		courses = data.savedCourses
		handleEmpty();
		// build and append the course list element
		for (var i = 0; i < courses.length; i++) {
			let {
				coursename,
				unique,
				profname,
				status,
				datetimearr
			} = courses[i];
			profname = capitalizeString(profname);
			let line = buildTimeLines(datetimearr);
			let list_tile_color = getStatusColor(status)
			let list_sub_color = getStatusColor(status, true);
			let {
				department,
				number
			} = seperateCourseNameParts(coursename)

			let list_html = Template.popupListItem(i, list_tile_color, unique, department, number, profname, list_sub_color, line);
			$("#courseList").append(list_html);
		}
	});
}

/* convert from the dtarr and maek the time lines*/
function buildTimeLines(datetimearr) {
	let lines = convertDateTimeArrToLine(datetimearr);
	let output = "";
	if (lines.length == 0) {
		output = "<span style='font-size:medium;'>This class has no meeting times.</span>"
	} else {
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			output += Template.popupLine(line)
		}
	}
	return output;
}

/* prettify the name for the conflict messages*/
function formatShortenedCourseName(course) {
	let {
		number,
		department
	} = seperateCourseNameParts(course.coursename)
	return `${department} ${number} (${course.unique})`;
}

/* Update the conflict messages */
function updateConflicts() {
	chrome.runtime.sendMessage({
		command: "checkConflicts"
	}, function (response) {
		if (response.isConflict) {
			var between = response.between;
			let conflict_message = "";
			for (var i = 0; i < between.length; i++) {
				let courseA = between[i][0];
				let courseB = between[i][1];
				conflict_message += `CONFLICT: ${formatShortenedCourseName(courseA)} and ${formatShortenedCourseName(courseB)}`;
				if (i != between.length - 1)
					conflict_message += "<br>";
			}
			$(Template.popupConflictMessage(conflict_message)).prependTo("#courseList").hide().fadeIn(200);
		}
	});
}



function handleRegisterButton(clicked_item, curr_course) {
	let {
		status,
		registerlink
	} = curr_course;
	let register_button = $(clicked_item).find("#register");
	let can_not_register = canNotRegister(status, registerlink);

	let register_text = can_not_register ? "Can't Register" :
		status.includes("waitlisted") ? "Join Waitlist" : "Register";
	let register_color = can_not_register ? Colors.closed :
		status.includes("waitlisted") ? Colors.waitlisted : Colors.open;

	$(register_button).text(register_text).css('background-color', register_color);
	if (!can_not_register) {
		$(register_button).click(function () {
			setCurrentTabUrl(registerlink);
		})
	}
}

function handleRemoveButton(clicked_item, curr_course) {
	let list = $(clicked_item).closest("ul");
	$(clicked_item).find("#listRemove").click(function () {
		if (can_remove) {
			can_remove = false;
			$(list).find("#conflict").fadeOut(300, function () {
				$(clicked_item).remove();
			});
			chrome.runtime.sendMessage({
				command: "courseStorage",
				course: curr_course,
				action: "remove"
			}, () => {
				$(clicked_item).fadeOut(200);
				if ($(list).children(':visible').length === 1)
					showEmpty();
				can_remove = true;
				updateConflicts();
				updateAllTabsCourseList();
			});
		}
	});
}

function handleMoreInfo(clicked_item, curr_course) {
	$(clicked_item).find("#listMoreInfo").click(function () {
		window.open(curr_course.link);
	});
}

function copyButtonAnimation() {
	$(this).find('i').text('check');
	$(this).stop(true, false).removeAttr('style').removeClass('shadow', {
		duration: 200
	});
	$(this).find('i').delay(400).queue(function (n) {
		$(this).text('content_copy');
		$(this).parent().removeClass('shadow');
		if ($(this).parent().is(":hover")) {
			$(this).parent().addClass('shadow');
		}
		n();
	})
}


function toggleTimeDropdown(clicked_item) {
	let more_info_button = $(clicked_item).find('#moreInfo');
	let arrow = $('clicked_item').find("#arrow");
	if ($(more_info_button).is(":hidden")) {
		$(more_info_button).fadeIn(200);
		$(arrow).css('transform', 'rotate(90deg)');
	} else {
		$(more_info_button).fadeOut(200);
		$(arrow).css('transform', '');
	}
}


$("#courseList").on('mouseover', '.copybut', function () {
	$(this).addClass('shadow');
}).on('mouseleave', '.copybut', function () {
	$(this).removeClass('shadow');
});

$("#courseList").on('click', '.copybut', function (e) {
	e.stopPropagation();
	var temp = $("<input>");
	copyButtonAnimation();
	$("body").append(temp);
	temp.val($(this).val()).select();
	document.execCommand("copy");
	temp.remove();
});

$("#courseList").on('click', 'li', function () {
	let clicked_item = $(this).closest('li');
	let curr_course = courses[$(clicked_item).attr("id")];
	handleMoreInfo(clicked_item, curr_course);
	handleRegisterButton(clicked_item, curr_course)
	handleRemoveButton(clicked_item, curr_course)
	toggleTimeDropdown(clicked_item);
});

$("#clear").click(function () {
	clear();
});

$("#schedule").click(function () {
	chrome.tabs.create({
		'url': 'https://registrar.utexas.edu/schedules'
	});
});

$("#impexp").click(function () {
	if ($("#impexp>i").text() == 'close') {
		hideImportExportPopup();
	} else {
		if ($("#search>i").text() == 'close') {
			hideSearchPopup();
		}
		showImportExportPopup();
	}
});

$("#search").click(function () {
	if ($("#search>i").text() == 'close') {
		hideSearchPopup();
	} else {
		if ($("#impexp>i").text() == 'close') {
			hideImportExportPopup();
		}
		showSearchPopup();
	}
});

$('#import-class').click(function () {
	$("#importOrig").click();
});

$('#export-class').click(function () {
	chrome.storage.sync.get('savedCourses', function (data) {
		if (data.savedCourses.length > 0) {
			var exportlink = document.createElement('a');
			var url = window.URL.createObjectURL(new Blob([JSON.stringify(data.savedCourses, null, 4)], {
				type: "octet/stream"
			}));
			exportlink.setAttribute('href', url);
			exportlink.setAttribute('download', 'my_courses.json');
			exportlink.click();
		} else {
			alert('No Saved Courses to Export.');
		}
	});
});

$("#search-class").click(() => {
	var unique_id = $("#class_id_input").val();
	if (!isNaN(unique_id)) {
		if (unique_id.length == 5) {
			let selected_semester = $("#semesters").find(":selected").val();
			openCoursePage(selected_semester, unique_id);
			$("#class_id_input").val('');
			return;
		}
	}
	alert("Oops, check your input. Class IDs should have 5 digits!");
});

$("#options_button").click(function () {
	chrome.tabs.create({
		'url': "options.html"
	});
});

$("#calendar").click(function () {
	chrome.tabs.create({
		'url': "calendar.html"
	});
});

$("#importOrig").change(function (e) {
	var files = e.target.files;
	var reader = new FileReader();
	reader.onload = function () {
		try {
			var imported_courses = JSON.parse(this.result);
			if (imported_courses && imported_courses.length && (imported_courses.length == 0 || validateObject(imported_courses))) {
				chrome.storage.sync.set({
					savedCourses: imported_courses
				});
				chrome.runtime.sendMessage({
					command: "updateBadge"
				});
				updateAllTabsCourseList();
				setCourseList();
				chrome.runtime.sendMessage({
					command: "updateStatus",
				});
			}
		} catch (err) {
			console.log(err);
		}
		importOrig.value = '';
	}
	reader.readAsText(files[0]);
});

function validateObject(imported_courses) {
	for (var i = 0; i < imported_courses.length; i++) {
		var course = imported_courses[i];
		var is_valid = true;
		var props = ["coursename", "datetimearr", "link", "profname", "status", "unique"];
		for (let j = 0; j < props.length; j++) {
			is_valid &= course.hasOwnProperty(props[j]);
		}
		if (!is_valid) {
			return false;
		}
	}
	return true;
}


/*Clear the list and the storage of courses*/
function clear() {
	chrome.storage.sync.set({
		savedCourses: []
	});
	updateAllTabsCourseList();
	chrome.runtime.sendMessage({
		command: "updateBadge"
	});
	$("#courseList").empty()
	console.log("cleared");
	showEmpty();
}

function getSemesters() {
	var schedule_list = 'https://registrar.utexas.edu/schedules';
	$.get(schedule_list, function (response) {
		if (response) {
			var object = $('<div/>').html(response).contents();
			object.find('.callout2>ul>li>a').each(function (index) {
				if (index < 2) {
					if ($(this).text() != "Course Schedule Archive") {
						const semester = $(this).text().split(" ")[0];
						const year = $(this).text().split(" ")[1]
						let sem_name = semester + " " + year;
						console.log('semname:::: ' + sem_name);
						$("#semesters").append(`<option>${sem_name}</option>`);
						$.get($(this).attr('href'), function (response) {
							if (response) {
								var object = $('<div/>').html(response).contents();

								// Check title of page and see if it matches semester name
								var name = object.find(".page-title").text();
								name = name.substring(name.lastIndexOf('|') + 1).trim();
								name = name.split(" ")[0] + " " + name.split(" ")[1];

								console.log('name:::: ' + name);
								object.find('.gobutton>a').each(function () {
									var sem_num = $(this).attr('href').substring($(this).attr('href').lastIndexOf('/') + 1);
									console.log('semnum:::: ' + sem_num);
									$("option").each(function () {
										console.log($(this).text());
										if ($(this).text() == name) {
											$(this).val(sem_num);
											console.log($(this).val());
										}
									})
								});
							}
						});
					}
				}
			});
		}
	});
}

function openCoursePage(sem, unique) {
	var link = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${sem}/${unique}/`;
	window.open(link);
}

function handleEmpty() {
	if (courses.length != 0) {
		$("#empty").hide();
		$("#courseList").show();
	} else {
		showEmpty();
	}
}

function showEmpty() {
	$("#courseList").hide();
	$("#empty").fadeIn(200);
	$("#main").html(Text.emptyText());
}

function hideSearchPopup() {
	$("#search>i").text('search');
	$("#class_id_input").hide();
	$("#semcon").hide();
	$("#semesters").hide();
	$("#search-popup").addClass('hide');
}

function showSearchPopup() {
	$("#search>i").text('close');
	$("#class_id_input").show();
	$("#semesters").show();
	$("#semcon").show();
	$('#class_id_input').focus();
	$("#search-popup").removeClass('hide');
}

function hideImportExportPopup() {
	$("#import-export-popup").addClass('hide');
	$("#impexp>i").text('import_export');
}

function showImportExportPopup() {
	$("#impexp>i").text('close');
	$("#import-export-popup").removeClass('hide');
}