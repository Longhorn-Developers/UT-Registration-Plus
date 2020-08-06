var courses;
var tab = "#courseList";

setCourseList();
getSemesters();
getDepartments();

var can_remove = true;
var can_unsubscribe = true;

function setCourseList() {
	// any tabs we were just on - clear/hide them and start fresh
	$(tab).empty();
	$(tab).hide();
	$(".meta").hide();

	// build the schedule and show it, setting it as the active tab
	tab = "#courseList";
	$(tab).empty();
	chrome.storage.sync.get('savedCourses', function (data) {
		updateConflicts();
		courses = data.savedCourses
		handleEmpty();
		let num_hours = 0;
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
			num_hours += parseInt(number.substring(0,1));

			let list_html = Template.Popup.list_item(i, list_tile_color, unique, department, number, profname, list_sub_color, line);
			$(tab).append(list_html);
		}
		$("#meta-metric").text(num_hours);
	});
	$(".meta").fadeIn(500);
	$(tab).fadeIn(500);
	$("#notificationsList").hide();
}

function setNotificationsList() {
	// any tabs we were just on - clear/hide them and start fresh
	$(tab).empty();
	$(tab).hide();
	$(".meta").hide();

	// build the schedule and show it, setting it as the active tab
	tab = "#notificationsList";
	$(tab).empty()
	chrome.storage.sync.get('notifications', function (data) {
		courses = data.notifications
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

			let notification = Template.Popup.notification(i, list_tile_color, unique, department, number, profname, list_sub_color, line);
			$(tab).append(notification);
		}
	});
	$(tab).fadeIn(500);
	$("#courseList").hide();
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
			output += Template.Popup.line(line);
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
			$(Template.Popup.conflict_message(conflict_message)).prependTo("#courseList").hide().fadeIn(250);
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

	// If we're not clicking on contactInfo button or imp/exp popup, and popup is visible, hide it
	if (!$target.closest('#contact').length && !$target.closest('#contact-info-popup').length && $('#contact-info-popup').is(":visible")) {
		hideContactInfoPopup();
	}

	// If we're not clicking on import/export button or imp/exp popup, and popup is visible, hide it
	if (!$target.closest('#impexp').length && !$target.closest('#import-export-popup').length && $('#import-export-popup').is(":visible")) {
		hideImportExportPopup();
	}
});

$("#clear").click(function () {
	if (tab == "#courseList") {
		chrome.storage.sync.set({
			savedCourses: []
		});
		updateAllTabsCourseList();
	} else {
		chrome.storage.sync.get('contactInfo', function(dataOne) {
			chrome.storage.sync.get('notifications', function(dataTwo) {
				let storedContact = dataOne.contactInfo["uteid"];
				let storedNotifications = dataTwo.notifications.map(course => course.unique);
				chrome.storage.sync.set({
					notifications: new Array()
				});
				let removed_info = {
					"uteid": storedContact,
					"courses": storedNotifications
				};
				fetch(Notification.db_clear_notif_hook, {
					method: 'POST',
					headers: {
					  'Content-Type': 'application/json'
					},
					body: JSON.stringify(removed_info)
				});
			});
		});
	}
	$(tab).empty();
	showEmpty();
});

$("#notificationsTab").click(function () {
	chrome.runtime.sendMessage({
		command: "hasContactInfo",
	}, function (response) {
		if(response.hasContactInfo){
			if (tab == "#courseList") {
				$("#notificationsTab").text("Hide Notified");
				setNotificationsList();
			} else {
				$("#notificationsTab").text("Show Notified");
				setCourseList();
			}
		} else {
			alert("Please enter your UT EID as well as one form of contact: email or phone (located at bell icon within the extension menu).\n\nThis allows us to know where to message you about courses that have been added to your notification list. Thanks! :)", "");
		}
	});
});

$("#RIS").click(function () {
	chrome.tabs.create({
		'url': 'https://utdirect.utexas.edu/registrar/ris.WBX'
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
		if ($("#contact>i").text() == 'close') {
			hideContactInfoPopup();
		}
		showImportExportPopup();
	}
});

$("#contact").click(function () {
	if ($("#contact>i").text() == 'close') {
		hideContactInfoPopup();
	} else {
		if ($("#impexp>i").text() == 'close') {
			hideImportExportPopup();
		}
		if ($("#search>i").text() == 'close') {
			hideSearchPopup();
		}
		showContactInfoPopup();
	}
});

$("#contact-info-popup").submit(function (view) {
	chrome.storage.sync.get('contactInfo', function() {
		saved_info = {
			"uteid": $("#uteid").val(),
			"email": $("#email").val(),
			"phone": $("#phone").val()
		}
		chrome.storage.sync.set({
			contactInfo: saved_info
		});
		let checkCurrentInfo = (saved_info.uteid && (saved_info.email || saved_info.phone)) ? true : false;
		if (checkCurrentInfo) {
			fetch(Contact.db_update_hook, {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(saved_info)
			});
		}
	});
	$("#saveInfo").val("Saved!");
	$("#saveInfo").css("color", "#4CAF50");
	view.preventDefault();
	setTimeout(function() {
		window.location.href="popup.html";
	}, 500);
});

$("#removeInfo").click(function (view) {
	let result = confirm("Opting out will result in removing all courses from your notification list as well as clearing all of your contact information to prevent further communication.\n\nAre you sure you want to opt out?");
	console.log(result);
	if (result) {
		chrome.storage.sync.get('contactInfo', function(dataOne) {
			chrome.storage.sync.get('notifications', function(dataTwo) {
				let storedContact = dataOne.contactInfo["uteid"];
				let storedNotifications = dataTwo.notifications.map(course => course.unique);
				chrome.storage.sync.set({
					notifications: new Array()
				});
				chrome.storage.sync.set({
					contactInfo: {
						"uteid": "",
						"email": "",
						"phone": ""
					}
				});
				let removed_info = {
					"uteid": storedContact,
					"courses": storedNotifications
				};
				fetch(Contact.db_optout_hook, {
					method: 'POST',
					headers: {
					  'Content-Type': 'application/json'
					},
					body: JSON.stringify(removed_info)
				});
			});
		});
		$("#removeInfo").text("Removed!");
		$("#removeInfo").css("color", "#F44336");
		setTimeout(function() {
				window.location.href="popup.html";
			}, 500);
		}
	view.preventDefault();
});

$("#search").click(function () {
	if ($("#search>i").text() == 'close') {
		hideSearchPopup();
	} else {
		if ($("#impexp>i").text() == 'close') {
			hideImportExportPopup();
		}
		if ($("#contact>i").text() == 'close') {
			hideContactInfoPopup();
		}
		showSearchPopup();
	}
});

$('#import-class').click(function () {
	$("#import_input").click();
	console.log('back to improting');
});

function isImportedValid(imported_courses) {
	return imported_courses && imported_courses.length && (imported_courses.length == 0 || validateCourses(imported_courses))
}

$("#import_input").change(function (e) {
	console.log('hello');
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
				$("#import_input").val('');
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

function openSearch(semester, department, level) {
	var link = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${semester}/results/?fos_fl=${department}&level=${level}&search_type_main=FIELD`
	chrome.tabs.create({ url: link});
}

$("#search-class").click(() => {
	let semester = $("#semesters").find(":selected").val();
	let department = $("#department").find(":selected").val();
	let level = $("#level").find(":selected").val();
	openSearch(semester, department, level);
});

$("#options_button").click(function () {
	chrome.tabs.create({
		'url': "options.html"
	});
});

$("#courseList").on('mouseover', '.copy_button', function () {
	$(this).addClass('shadow');
}).on('mouseleave', '.copy_button', function () {
	$(this).removeClass('shadow');
});

$("#courseList").on('click', '.copy_button', function (e) {
	e.stopPropagation();
	copyButtonAnimation($(this));
	let unique = $(this).val();
	copyUnique(unique);
});

$("#notificationsList").on('mouseover', '.copy_button', function () {
	$(this).addClass('shadow');
}).on('mouseleave', '.copy_button', function () {
	$(this).removeClass('shadow');
});

$("#notificationsList").on('click', '.copy_button', function (e) {
	e.stopPropagation();
	copyButtonAnimation($(this));
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

$("#notificationsList").on('click', 'li', function () {
	let clicked_item = $(this).closest('li');
	let curr_course = courses[$(clicked_item).attr("id")];
	handleMoreInfo(clicked_item, curr_course);
	handleRegister(clicked_item, curr_course)
	handleUnsubscribe(clicked_item, curr_course)
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

	if(!status){
		register_text = "No Status";
		register_color = Colors.no_status;
	}

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
			$(list).find("#conflict").fadeOut(250, function () {
				$(clicked_item).remove();
			});
			subtractHours(curr_course);
			chrome.runtime.sendMessage({
				command: "courseStorage",
				course: curr_course,
				action: "remove"
			}, () => {
				$(clicked_item).fadeOut(250);
				if ($(list).children(':visible').length === 1)
					showEmpty();
				can_remove = true;
				updateConflicts();
				updateAllTabsCourseList();
			});
		}
	});
}

function handleUnsubscribe(clicked_item, curr_course) {
	let list = $(clicked_item).closest("ul");
	$(clicked_item).find("#unsubscribe").click(function () {
		if (can_remove) {
			can_remove = false;
			chrome.runtime.sendMessage({
				command: "courseNotification",
				course: curr_course,
				action: "unsubscribe"
			}, () => {
				$(clicked_item).fadeOut(250);
				can_remove = true;
			});
			chrome.storage.sync.get('contactInfo', function (data) {
				let storedUTEID = data.contactInfo.uteid;
				if (storedUTEID) {
					let remove = {
						"id": curr_course.unique,
						"uteid": storedUTEID
					};
					fetch(Notification.db_remove_notif_hook, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(remove)
					});
				}
			});
		}
	});
}

function subtractHours(curr_course){
	let curr_total_hours = parseInt($("#meta-metric").text());
	let curr_course_number = seperateCourseNameParts(curr_course.coursename).number;
	let curr_individual_hours = parseInt(curr_course_number.substring(0,1));
	$("#meta-metric").text(curr_total_hours-curr_individual_hours);

}

function handleMoreInfo(clicked_item, curr_course) {
	$(clicked_item).find("#listMoreInfo").click(function () {
		openMoreInfoWithOpenModal(curr_course.link);
	});
}

function handleEmpty() {
	if (courses.length != 0) {
		$("#empty").hide();
		$(tab).show();
	} else {
		showEmpty();
	}
}

function copyButtonAnimation(copy_button) {
	$(copy_button).find('i').text('check');
	$(copy_button).stop(true, false).removeAttr('style').removeClass('shadow', {
		duration: 250
	});
	$(copy_button).find('i').delay(500).queue(function (n) {
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
	let arrow = $(clicked_item).find("#arrow");
	if ($(more_info_button).is(":hidden")) {
		$(more_info_button).fadeIn(250);
		$(arrow).css('transform', 'rotate(90deg)');
	} else {
		$(more_info_button).fadeOut(250);
		$(arrow).css('transform', '');
	}
}

function showEmpty() {
	$(tab).hide();
	$("#empty").fadeIn(250);
	$("#main").html(Text.emptyText());
	if (tab == "#courseList") {
		$("#meta-metric").text('0');
	}
}

function hideSearchPopup() {
	$("#search>i").text('search');
	$("#semcon").hide();
	$("#depcon").hide();
	$("#semesters").hide();
	$("#levcon").hide();
	$("#search-popup").addClass('hide');
}

function showSearchPopup() {
	$("#search>i").text('close');
	$("#class_id_input").show();
	$("#semesters").show();
	$("#semcon").show();
	$("#depcon").show();
	$("#levcon").show();
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

function hideContactInfoPopup() {
	setTimeout(function() {
		$("#contact-info-popup").addClass('hide');
		$("#contact>i").text('notifications_none');
		window.location.href="popup.html";
	}, 500);
}

function showContactInfoPopup() {
	chrome.storage.sync.get('contactInfo', function(data) {
		let storedUTEID = data.contactInfo.uteid;
		let storedEmail = data.contactInfo.email;
		let storedPhone = data.contactInfo.phone;
		if (storedUTEID || storedEmail || storedPhone) {
			$("#saveInfo").prop("value", "Update");
		}
		if (storedUTEID.length > 0) {
			$("#uteid").val(storedUTEID);
			$("#uteid").css("color", "rgb(255, 152, 0)");
			$("#uteid").attr("readonly", true);
		}
		if (storedEmail.length > 0) {
			$("#email").val(storedEmail);
		}
		if (storedPhone.length > 0) {
			$("#phone").val(storedPhone);
		}
	});
	$("#contact>i").text('close');
	$("#contact-info-popup").removeClass('hide');
}

function getSemesters() {
	chrome.runtime.sendMessage({
		command: "currentSemesters"
	}, function(response){
		let { semesters } = response;
		let semester_names = Object.keys(semesters);
		for(let i = 0; i<semester_names.length;i++){
			let name = semester_names[i];
			$("#semesters").append(`<option value='${semesters[name]}'>${name}</option>`);
		}
	});
}

function getDepartments() {
	chrome.runtime.sendMessage({
		command: "currentDepartments"
	}, function(response){
		let { departments } = response;
		console.log(departments);
		for(let i = 0; i<departments.length; i++){
			let abv = departments[i];
			$("#department").append(`<option value='${abv}'>${abv}</option>`);
		}
		$("#department").val('C S');
	});
}
