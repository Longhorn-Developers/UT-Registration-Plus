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

			let list_html = Template.Popup.list_item(i, list_tile_color, unique, department, number, profname, list_sub_color, line);
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
			output += Template.Popup.line(line)
		}
	}
	return output;
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
			$(Template.Popup.conflict_message(conflict_message)).prependTo("#courseList").hide().fadeIn(200);
		}
	});
}

/* prettify the name for the conflict messages*/
function formatShortenedCourseName(course) {
	let {
		number,
		department
	} = seperateCourseNameParts(course.coursename)
	return `${department} ${number} (${course.unique})`;
}

$(document).click(function (event) {
	$target = $(event.target);

	// If we're not clicking on search button or search popup, and popup is visible, hide it
	if (!$target.closest('#search').length && !$target.closest('#search-popup').length && $('#search-popup').is(":visible")) {
		hideSearchPopup();
	}

	// If we're not clicking on import/export button or imp/exp popup, and popup is visible, hide it
	if (!$target.closest('#impexp').length && !$target.closest('#import-export-popup').length && $('#import-export-popup').is(":visible")) {
		hideImportExportPopup();
	}
});

$("#clear").click(function () {
	chrome.storage.sync.set({
		savedCourses: []
	});
	$("#courseList").empty();
	updateAllTabsCourseList();
	showEmpty();
});

$("#schedule").click(function () {
	chrome.tabs.create({
		'url': 'https://registrar.utexas.edu/schedules'
	});
});

$("#calendar").click(function () {
	chrome.tabs.create({
		'url': "calendar.html"
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
	$("#import_input").click();
});

function isImportedValid(imported_courses) {
	return imported_courses && imported_courses.length && (imported_courses.length == 0 || validateCourses(imported_courses))
}

$("#import_input").change(function (e) {
	var files = e.target.files;
	var reader = new FileReader();
	reader.onload = function () {
		try {
			var imported_courses = JSON.parse(this.result);
			if (isImportedValid(imported_courses)) {
				chrome.storage.sync.set({
					savedCourses: imported_courses
				});
				updateAllTabsCourseList();
				setCourseList();
				hideImportExportPopup();
			} else {
				Alert('There was an error.');
			}
		} catch (err) {
			console.log(err);
		}
	}
	reader.readAsText(files[0]);
});


function exportCourses(url) {
	var exportlink = document.createElement('a');
	exportlink.setAttribute('href', url);
	exportlink.setAttribute('download', 'my_courses.json');
	exportlink.click();
}

function createBlob(export_courses) {
	return new Blob([JSON.stringify(export_courses, null, 4)], {
		type: "octet/stream"
	})
}

$('#export-class').click(function () {
	chrome.storage.sync.get('savedCourses', function (data) {
		let export_courses = data.savedCourses;
		if (export_courses.length > 0) {
			let url = window.URL.createObjectURL(createBlob(export_courses));
			exportCourses(url);
		} else {
			alert('No Saved Courses to Export.');
		}
		hideImportExportPopup();
	});
});

function openCoursePage(sem, unique) {
	var link = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${sem}/${unique}/`;
	window.open(link);
}

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



$("#courseList").on('mouseover', '.copybut', function () {
	$(this).addClass('shadow');
}).on('mouseleave', '.copybut', function () {
	$(this).removeClass('shadow');
});

$("#courseList").on('click', '.copybut', function (e) {
	e.stopPropagation();
	copyButtonAnimation();
	let unique = $(this).val();
	copyUnique(unique);
});

function copyUnique(unique) {
	var temp = $("<input>");
	$("body").append(temp);
	temp.val(unique).select();
	document.execCommand("copy");
	temp.remove();
}

$("#courseList").on('click', 'li', function () {
	let clicked_item = $(this).closest('li');
	let curr_course = courses[$(clicked_item).attr("id")];
	handleMoreInfo(clicked_item, curr_course);
	handleRegister(clicked_item, curr_course)
	handleRemove(clicked_item, curr_course)
	toggleTimeDropdown(clicked_item);
});


function handleRegister(clicked_item, curr_course) {
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

function handleRemove(clicked_item, curr_course) {
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

function handleEmpty() {
	if (courses.length != 0) {
		$("#empty").hide();
		$("#courseList").show();
	} else {
		showEmpty();
	}
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



function getSemesters() {
	var schedule_list = 'https://registrar.utexas.edu/schedules';
	$.get(schedule_list, function (response) {
		if (response) {
			htmlToNode(response).find('.callout2>ul>li>a').each(function (i) {
				if (i < Popup.num_semesters) {
					let sem_name = $(this).text().trim();
					if (sem_name != "Course Schedule Archive") {
						$("#semesters").append(`<option>${sem_name}</option>`);
						$.get($(this).attr('href'), function (response) {
							if (response) {
								let response_node = htmlToNode(response);
								let name = response_node.find(".page-title").text().substring(17).trim();
								response_node.find('.gobutton>a').each(function () {
									let link = $(this).attr('href');
									var sem_num = link.substring(link.lastIndexOf('/') + 1).trim();
									$("option").each(function () {
										if ($(this).text() == name)
											$(this).val(sem_num);
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