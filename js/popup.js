var courses;
// get the courses from storage
chrome.storage.sync.get('savedCourses', function (data) {
	//find, build, and show the messages for the conflicts in the saved courses
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
			$("#courseList").prepend("<p style='font-size:small; font-weight:bold; color:red; margin:5px 5px 5px 10px'>" + text + "</>");
		}
	});
	courses = data.savedCourses;
	if (courses.length != 0) {
		$("#empty").hide();
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
			color = "#F44336";
		}
		var department = courses[i].coursename.substring(0, courses[i].coursename.search(/\d/) - 2);
		var course_nbr = courses[i].coursename.substring(courses[i].coursename.search(/\d/), courses[i].coursename.indexOf(" ", courses[i].coursename.search(/\d/)));
		var profname = courses[i].profname.substring(0, 1) + courses[i].profname.substring(1).toLowerCase();
		var listhtml = "<li id='" + i + "'style='padding: 0px 5px 5px 5px; overflow-y: auto;max-height:400px;'><div class='card'><div class='container' style='background:" + color + "''><h4 class='truncate' style='color:white;margin:5px; display:inline-block;font-size:large;'><b>" + department + " " + course_nbr + "<span style='font-size:medium'>" + " with </span><span style='font-size:medium'>" + profname + " (" + courses[i].unique + ")" + "</span></b></h4><p style='float:right;font-size:small;display:inline-block;margin-top:10px;color:white;'>&#9660;</p></div></div><div id='moreInfo' style='display: none;'><p style='font-weight:bold;padding:10px;margin:0px;font-size:small;background-color:#FFCDD2;'>" + makeLine(i) + "</p><div id='infoButtons' style='border-radius:0px;'><button class='matbut' id='listRemove'style='float:right;background:#F44336; margin:5px;'>Remove</button><button class='matbut' id='listMoreInfo' style='float:right;background:#2196F3; margin:5px;'>More Info</button></div></div></li>";
		$("#courseList").append(listhtml);
	}
});

/* prettify the name for the conflict messages*/
function getSimpleName(coursename, unique) {
	var department = coursename.substring(0, coursename.search(/\d/) - 2);
	var course_nbr = coursename.substring(coursename.search(/\d/), coursename.indexOf(" ", coursename.search(/\d/)));
	return department + " " + course_nbr + " (" + unique + ")";
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
				text += "Conflict between: " + getSimpleName(between[i][0].coursename, between[i][0].unique) + " and " + getSimpleName(between[i][1].coursename, between[i][1].unique);
				isConflicted.push(between[i][0].unique);
				isConflicted.push(between[i][1].unique);
				if (i != between.length - 1) {
					text += "<br>";
				}
			}
			$("#courseList").prepend("<p style='font-size:small; font-weight:bold; color:red; margin:5px;'>" + text + "</>");
		}
	});
}

/* Handle the button clicks */
$(document).ready(function () {
	$("#courseList li").click(function () {
		$(this).find("#listMoreInfo").click(function () {
			window.open(courses[$(this).closest("li").attr("id")].link);
		});
		/* clear the conflict messages, then remove the course and updateConflicts. update the tabs*/
		$(this).find("#listRemove").click(function () {
			var thisForm = this;
			$(thisForm).closest("ul").find("> p").remove();
			chrome.runtime.sendMessage({
				command: "courseStorage",
				course: courses[$(thisForm).closest("li").attr("id")],
				action: "remove"
			}, function (response) {
				$(thisForm).closest("li").fadeOut(200);
				if ($(thisForm).closest("ul").children(':visible').length === 1) {
					$("#courseList").fadeOut(300, function () {
						$("#empty").fadeIn(200);
					});
				}
				updateConflicts();
				chrome.tabs.query({}, function (tabs) {
					for (var i = 0; i < tabs.length; i++) {
						chrome.tabs.sendMessage(tabs[i].id, {
							command: "updateCourseList"
						});
					}
				});
			});
		});
		/* Show the times popout and more info options*/
		if ($(this).find("#moreInfo").is(":hidden")) {
			$(this).find("#moreInfo").fadeIn(200);
		} else {
			$(this).find("#moreInfo").fadeOut(200);
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

/* convert from the dtarr and maek the time lines*/
function makeLine(index) {
	var datetimearr = courses[index].datetimearr;
	//converted times back
	var dtmap = new Map([]);
	for (var i = 0; i < datetimearr.length; i++) {
		datetimearr[i][1][0] = moment(datetimearr[i][1][0], ["HH:mm"]).format("h:mm A");
		datetimearr[i][1][1] = moment(datetimearr[i][1][1], ["HH:mm"]).format("h:mm A");
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
	for (var i = 0; i < dayarr.length; i++) {
		output += "<span style='font-size:medium'>" + dayarr[i] + "</span>: <span style='float:right'>" + timearr[i].split(",")[0] + " to " + timearr[i].split(",")[1] + "</span><br>";
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
	console.log("cleared");
	$("#courseList").fadeOut(300, function () {
		$("#empty").fadeIn(200);
	});
}