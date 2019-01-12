var courses;
// get the courses from storage

setCourseList();

// var modhtml = '<div class=modal id=myModal><div class=modal-content><span class=close>×</span><div class=card><div class=cardcontainer></div></div></div></div>';
// $("#html").prepend(modhtml);
getSemesters();
var canremove = true;

function setCourseList() {
	$("#courseList").empty()
	chrome.storage.sync.get('savedCourses', function (data) {
		updateConflicts();
		courses = data.savedCourses
		console.log(courses.length);
		if (courses.length != 0) {
			$("#empty").hide();
			$("#courseList").show();
		} else {
			showEmpty();
		}
		// build and append the course list element
		for (var i = 0; i < courses.length; i++) {
			var color;
			status = courses[i].status;
			if (status.includes("open")) {
				color = "#4CAF50";
			} else if (status.includes("waitlisted")) {
				color = "#FF9800"
			} else if (status.includes("closed") || status.includes("cancelled")) {
				color = "#FF5722";
			}
			var department = courses[i].coursename.substring(0, courses[i].coursename.search(/\d/) - 2);
			var course_nbr = courses[i].coursename.substring(courses[i].coursename.search(/\d/), courses[i].coursename.indexOf(" ", courses[i].coursename.search(/\d/)));
			var profname = prettifyName(courses[i].profname);
			if (profname == "") {
				profname = "Undecided Professor";
			}
			var listhtml = `<li id='${i}'style='padding: 0px 5px 5px 5px; overflow-y: auto;max-height:400px;'>
								<div class='card'>
									<div class='container' style='background:${color}'>
										<h4 class='truncate' style='color:white;margin:5px; display:inline-block;font-size:large;'>
											<b>${department} ${course_nbr} <span style='font-size:medium'> with <span style='font-size:medium'>${profname} (${courses[i].unique})</span></b>
										</h4>
										<p id='arrow' style='float:right;font-size:small;display:inline-block;margin-top:10px;color:white;font-family: sans-serif'>&#9658;</p>
									</div>
								</div>
								<div id='moreInfo' style='display: none;'>
									<p style='font-weight:bold;padding:10px;margin:0px 5px 0px 15px;font-size:small;background-color:#FFCDD2;'>${makeLine(i)}</p>
									<div id='infoButtons' style='border-radius:0px;'>
										<button class='matbut' id='listRemove'style='float:right;background:#F44336; margin:5px;'>Remove</button>
										<button class='matbut' id='register' style='float:right;background:#4CAF50; margin:5px;'>Register</button>
										<button class='matbut' id='listMoreInfo' style='float:right;background:#2196F3; margin:5px;'>More Info</button>
									</div>
								</div>
							</li>`;
			$("#courseList").append(listhtml);
		}
	});
}



function showEmpty() {
	var emptyText = ["Doesn't Look Like Anything To Me.", "You Can't Fail Classes You're Not In.", "Pro-Tip: Don't Take O-Chem.",
		"No Work Happens On PCL 5th Floor.", "Sophomore But Freshman By Credit.", "Pain is temporary, GPA is forever.",
		"You've Yee'd Your Last Haw.", "lol everything is already waitlisted.", "At Least You're Not At A&M.",
		`It's ${moment().format("h:mm")} and OU Still Sucks.`, 'TeXAs iS BaCK GuYZ', "'Academically Challenged'",
		'Does McCombs teach Parseltongue?', 'Lets make Daddy Fenves proud.', 'Feel bad if you say Wampus.', 'No Cruce Enfrente Del Bus.',
		'Midterm 1 has been Unmuted', 'Omae Wa Mou Shindeiru...', 'Bevo Bucks are the new Bitcoin'
	]
	// console.log(emptyText.length);
	$("#courseList").hide();
	$("#empty").fadeIn(200);
	$("#main").html(emptyText[Math.floor(Math.random() * emptyText.length)]);
}

/* prettify the name for the conflict messages*/
function getSimpleName(coursename, unique) {
	var department = coursename.substring(0, coursename.search(/\d/) - 2);
	var course_nbr = coursename.substring(coursename.search(/\d/), coursename.indexOf(" ", coursename.search(/\d/)));
	return department + " " + course_nbr + " (" + unique + ")";
}

/* Format the Professor Name */
function prettifyName(profname) {
	return profname.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

/* Update the conflict messages */
function updateConflicts() {
	chrome.runtime.sendMessage({
		command: "checkConflicts"
	}, function (response) {
		var isConflicted = [];
		if (response.isConflict) {
			var between = response.between;
			var text = "";
			for (var i = 0; i < between.length; i++) {
				text += "CONFLICT: " + getSimpleName(between[i][0].coursename, between[i][0].unique) + " and " + getSimpleName(between[i][1].coursename, between[i][1].unique);
				isConflicted.push(between[i][0].unique);
				isConflicted.push(between[i][1].unique);
				if (i != between.length - 1) {
					text += "<br>";
				}
			}
			$("<p id='conflict' style='font-size:small; font-weight:bold; color:red; margin:5px 5px 5px 10px'>" + text + "</>").prependTo("#courseList").hide().fadeIn(200);
		}
	});
}

/* Handle the button clicks */
$(document).ready(function () {
	$("#courseList").on('click', 'li', function () {
		$(this).find("#listMoreInfo").click(function () {
			window.open(courses[$(this).closest("li").attr("id")].link);
		});
		let status = courses[$(this).closest("li").attr("id")].status;
		let registerlink = courses[$(this).closest("li").attr("id")].registerlink;
		if (status.includes("closed") || status.includes("cancelled") || !status || !registerlink) {
			$(this).find("#register").text("Can't Register").css("background-color", "#FF5722");
		} else {
			if (status.includes("waitlisted")) {
				$(this).find("#register").text("Join Waitlist").css("background-color", "#FF9800");
			} else {
				$(this).find("#register").text("Register").css("background-color", "#4CAF50");
			}
			$(this).find("#register").click(function () {
				chrome.tabs.query({
					currentWindow: true,
					active: true
				}, function (tab) {
					chrome.tabs.update(tab.id, {
						url: registerlink
					});
				});
			})
		}
		/* clear the conflict messages, then remove the course and updateConflicts. update the tabs*/
		$(this).find("#listRemove").click(function () {
			var thisForm = this;
			if (canremove) {
				canremove = false;
				$(thisForm).closest("ul").find("#conflict").fadeOut(300, function () {
					$(this).remove();
				});
				chrome.runtime.sendMessage({
					command: "courseStorage",
					course: courses[$(thisForm).closest("li").attr("id")],
					action: "remove"
				}, function (response) {
					$(thisForm).closest("li").fadeOut(200);
					if ($(thisForm).closest("ul").children(':visible').length === 1) {
						showEmpty();
					}
					canremove = true;
					console.log('computedconflicts');
					updateConflicts();
					chrome.tabs.query({}, function (tabs) {
						for (var i = 0; i < tabs.length; i++) {
							chrome.tabs.sendMessage(tabs[i].id, {
								command: "updateCourseList"
							});
						}
					});
				});
			}

		});
		/* Show the times popout and more info options*/
		if ($(this).find("#moreInfo").is(":hidden")) {
			$(this).find("#moreInfo").fadeIn(200);
			$(this).find('#arrow').css('transform', 'rotate(90deg)');

		} else {
			$(this).find("#moreInfo").fadeOut(200);
			$(this).find('#arrow').css('transform', '');

		}
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
			$('#import').hide();
			$('#export').hide();
			$("#impexp>i").text('import_export');
			// $(this).removeClass('selected');
		} else {
			$("#impexp>i").text('close');
			$('#import').show();
			// $(this).addClass('selected');
			$('#export').show();
		}
	});
	$("#search").click(function () {
		if ($("#search>i").text() == 'close') {
			$("#search>i").text('search');
			$("#class_id").hide();
			$("#semcon").hide();
			$("#semesters").hide();
			// $(this).removeClass('selected');
		} else {
			$("#search>i").text('close');
			$("#class_id").show();
			$("#semesters").show();
			$("#semcon").show();
			$('#class_id').focus();
			// $(this).addClass('selected');
		}
	});
	$('#import').click(function () {
		$("#importOrig").click();
	});
	$('#export').click(function () {
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
	$("#class_id").on("keyup", function (e) {
		if (e.keyCode == 13) {
			var unique = $(this).val();
			if (!isNaN(unique)) {
				if (unique.length == 5) {
					getInfo($("#semesters").find(":selected").val(), unique);
					return;
				}
			}
			alert("Invalid Input");
		}
	})
	$("#open").click(function () {
		chrome.tabs.create({
			'url': "options.html"
		});
	});
	$("#calendar").click(function () {
		chrome.tabs.create({
			'url': "calendar.html"
		});
	});
});


$("#importOrig").change(function (e) {
	var files = e.target.files;
	var reader = new FileReader();
	reader.onload = function () {
		try {
			var impCourses = JSON.parse(this.result);
			console.log(impCourses);
			if (impCourses && impCourses.length && (impCourses.length == 0 || validateObject(impCourses))) {
				chrome.storage.sync.set({
					savedCourses: impCourses
				});
				chrome.browserAction.setBadgeBackgroundColor({
					color: '#bf5700'
				});
				chrome.browserAction.setBadgeText({
					text: "" + impCourses.length
				});
				chrome.tabs.query({}, function (tabs) {
					for (var i = 0; i < tabs.length; i++) {
						chrome.tabs.sendMessage(tabs[i].id, {
							command: "updateCourseList"
						});
					}
				});
				setCourseList();
			}
		} catch (err) {

		}
		importOrig.value = '';
	}
	reader.readAsText(files[0]);
});

function validateObject(impCourses) {
	for (var i = 0; i < impCourses.length; i++) {
		var course = impCourses[i];
		var isValid = true;
		var props = ["coursename", "datetimearr", "link", "profname", "status", "unique"];
		console.log(course.coursename);
		for (let j = 0; j < props.length; j++) {
			isValid &= course.hasOwnProperty(props[j]);
		}
		console.log(isValid);
		if (!isValid) {
			return false;
		}
	}
	return true;
}

/* convert from the dtarr and maek the time lines*/
function makeLine(index) {
	var datetimearr = courses[index].datetimearr;
	//converted times back
	var dtmap = new Map([]);
	for (var i = 0; i < datetimearr.length; i++) {
		datetimearr[i][1][0] = moment(datetimearr[i][1][0], ["HH:mm"]).format("h:mm a");
		datetimearr[i][1][1] = moment(datetimearr[i][1][1], ["HH:mm"]).format("h:mm a");
	}
	for (var i = 0; i < datetimearr.length; i++) {
		if (dtmap.has(String(datetimearr[i][1]))) {
			dtmap.set(String(datetimearr[i][1]), dtmap.get(String(datetimearr[i][1])) + datetimearr[i][0]);
		} else {
			dtmap.set(String(datetimearr[i][1]), datetimearr[i][0]);
		}
	}
	var output = "";
	var timearr = Array.from(dtmap.keys());
	var dayarr = Array.from(dtmap.values());

	if (timearr.length == 0) {
		output = "<span style='font-size:medium;'>This class has no meeting times.</span>"
	} else {
		for (var i = 0; i < dayarr.length; i++) {
			var place = findLoc(dayarr[i], timearr[i], datetimearr);
			var building = place.substring(0, place.search(/\d/) - 1);
			if (building == "") {
				building = "Undecided Location";
			}
			output += `<span style='display:inline-block;width: 20%;'>${dayarr[i]}:</span><span style='margin-left:10px;display:inline-block;width: 50%;text-align:center;'>${timearr[i].split(",")[0]} to ${timearr[i].split(",")[1]}</span><span style='float:right;display:inline-block;text-align:right;width: 25%;'><a target='_blank' style='color:#3c87a3;text-decoration:none;'href='https://maps.utexas.edu/buildings/UTM/${building}'>${place}</a></span><br>`;
		}
	}
	return output;
}


//find the location of a class given its days and timearrs.
function findLoc(day, timearr, datetimearr) {
	for (let i = 0; i < datetimearr.length; i++) {
		var dtl = datetimearr[i];
		// console.log(dtl[1]);
		// console.log(timearr);
		if (day.includes(dtl[0])) {
			if (JSON.stringify(timearr) == JSON.stringify(fixDtl1(dtl[1]))) {
				return dtl[2];
			}
		}
	}
}

function fixDtl1(dtl1) {
	let output = "";
	for (let i = 0; i < dtl1.length; i++) {
		output += dtl1[i];
		if (i != dtl1.length - 1) {
			output += ",";
		}
	}
	return output;
}


/*Clear the list and the storage of courses*/
function clear() {
	chrome.storage.sync.set({
		savedCourses: []
	});
	chrome.tabs.query({}, function (tabs) {
		for (var i = 0; i < tabs.length; i++) {
			chrome.tabs.sendMessage(tabs[i].id, {
				command: "updateCourseList"
			});
		}
	});
	chrome.browserAction.setBadgeBackgroundColor({
		color: '#bf5700'
	});
	chrome.browserAction.setBadgeText({
		text: ""
	});
	$("#courseList").empty()
	console.log("cleared");
	showEmpty();
}

function getSemesters() {
	var schedulelist = 'https://registrar.utexas.edu/schedules';
	chrome.runtime.sendMessage({
		method: "GET",
		action: "xhttp",
		url: schedulelist,
		data: ""
	}, function (response) {
		if (response) {
			var object = $('<div/>').html(response).contents();
			object.find('.callout2>ul>li>a').each(function (index) {
				if (index < 2) {
					if ($(this).text() != "Course Schedule Archive") {
						var semname = $(this).text().split(" ")[0].substring(0, 2) + " " + $(this).text().split(" ")[1];
						$("#semesters").append(`<option>${semname}</option>`);
						chrome.runtime.sendMessage({
							method: "GET",
							action: "xhttp",
							url: $(this).attr('href'),
							data: ""
						}, function (response) {
							if (response) {
								var object = $('<div/>').html(response).contents();
								var name = object.find(".page-title").text();
								name = name.substring(name.lastIndexOf('|') + 1).trim();
								name = name.split(" ")[0].substring(0, 2) + " " + name.split(" ")[1];
								console.log(name);
								object.find('.gobutton>a').each(function () {
									var semnum = $(this).attr('href').substring($(this).attr('href').lastIndexOf('/') + 1);
									$("option").each(function () {
										console.log($(this).text());
										if ($(this).text() == name) {
											$(this).val(semnum);
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


/*Course object for passing to background*/
function Course(coursename, unique, profname, datetimearr, status, link, registerlink) {
	this.coursename = coursename;
	this.unique = unique;
	this.profname = profname;
	this.datetimearr = datetimearr;
	this.status = status;
	this.link = link;
	this.registerlink = registerlink;
}


function getInfo(sem, unique) {
	var link = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${sem}/${unique}/`;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", link, false);
	xhr.send();
	var response = xhr.responseText;
	if (response) {
		var output = "";
		var object = $('<div/>').html(response).contents();
		console.log(object.find('.error').text());
		if (object.find('.error').text().trim() == 'No class was found for your input.') {
			window.confirm(`Could not find a course with unique number: ${unique}`);
		} else {
			var c = getCourseObject(object, link);
			console.log(c);
			if (c.coursename) {
				chrome.runtime.sendMessage({
					command: "courseStorage",
					course: c,
					action: "add"
				}, function () {
					chrome.runtime.sendMessage({
						command: "updateCourseList"
					});
					setCourseList();
				});
			} else {
				window.confirm("There Was An Error. Please check if you are logged into Utexas.")
			}
		}
	}
}


/*For a row, get all the course information and add the date-time-lines*/
function getCourseObject(object, link) {
	let coursename = object.find("#details h2").text();
	let uniquenum = object.find('td[data-th="Unique"]').text();
	let profname = object.find("td[data-th='Instructor']").text().split(', ')[0];
	if (profname.indexOf(" ") == 0) {
		profname = profname.substring(1);
	}
	let datetimearr = getDtarr(object);
	let status = object.find('td[data-th="Status"]').text();
	let indlink = link;
	let registerlink = object.find('td[data-th="Add"] a').prop('href');
	return new Course(coursename, uniquenum, profname, datetimearr, status, indlink, registerlink);
}

/* For a row, get the date-time-array for checking conflicts*/
function getDtarr(object) {
	var numlines = object.find('td[data-th="Days"]>span').length;
	var dtarr = [];
	for (var i = 0; i < numlines; i++) {
		var date = object.find('td[data-th="Days"]>span:eq(' + i + ')').text();
		var time = object.find('td[data-th="Hour"]>span:eq(' + i + ')').text();
		var place = object.find('td[data-th="Room"]>span:eq(' + i + ')').text();
		for (var j = 0; j < date.length; j++) {
			var letter = date.charAt(j);
			var day = "";
			if (letter == "T" && j < date.length - 1 && date.charAt(j + 1) == "H") {
				dtarr.push(["TH", convertTime(time), place]);
			} else {
				if (letter != "H") {
					dtarr.push([letter, convertTime(time), place]);
				}
			}
		}
	}
	return dtarr;
}

/*Convert time to 24hour format*/
function convertTime(time) {
	var converted = time.replace(/\./g, '').split("-");
	for (var i = 0; i < 2; i++) {
		converted[i] = moment(converted[i], ["h:mm A"]).format("HH:mm");
	}
	return converted;
}