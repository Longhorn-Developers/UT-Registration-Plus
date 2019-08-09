var next = $("#next_nav_link");
var bottom;
var semesterCode;
var doneLoading = true;


var curr_course = {}


//This extension may be super lit, but you know what's even more lit?
//Matthew Tran's twitter and insta: @MATTHEWTRANN and @matthew.trann

console.log('UT Registration Plus is running on this page.');

semesterCode = new URL(window.location.href).pathname.split('/')[4];


$(window).scroll(function () {
	if ($(document).height() <= $(window).scrollTop() + $(window).height() + 150) {
		loadNextPages();
	}
});

if (next) {
	chrome.storage.sync.get('loadAll', function (data) {
		if (data.loadAll) {
			$('[title*="next listing"]').remove();
		}
	});
}

//make heading and modal
if (!$("#kw_results_table").length) {
	$("table thead th:last-child").after('<th scope=col>Plus</th>');
	$("table").after(`<div style="text-align:center">
						<div class="loader" id='loader'></div>
						<br>
						<h1 id="nextlabel"style="color: #FF9800;display:none;">Loading Courses</h1>
						<h1 id="retrylabel"style="color: #F44336;display:none;">Failed to Load Courses</h1>
						<br>
						<button class=matbut id="retry" style="background: #F44336;display:none;">Retry</button>
					  </div>`);
	$("#container").prepend(mainModal());
	$("#myModal").prepend("<div id='snackbar'>save course popup...</div>");
	//go through all the rows in the list
	$('table').find('tr').each(function () {
		if (!($(this).find('td').hasClass("course_header")) && $(this).has('th').length == 0) {
			//if a course row, then add the extension button
			$(this).append(`<td data-th="Plus"><input type="image" class="distButton" id="distButton" style="vertical-align: bottom; display:block;" width="20" height="20" src='${chrome.extension.getURL('images/disticon.png')}'/></td>`);
		}
	});
}
//update the conflicts
update(0);
/*Handle the button clicks*/
$("body").on('click', '#distButton', function () {
	var row = $(this).closest('tr');
	$('.modal-content').stop().animate({
		scrollTop: 0
	}, 500);
	$(this).blur();
	curr_course = getCourseInfo(row);
	getDistribution(curr_course);
});


$("#myModal").on('click', '#saveCourse', function () {
	setTimeout(function () {
		saveCourse();
	}, 0);
});

$("#Syllabi").click(function () {
	setTimeout(function () {
		window.open(curr_course["links"]["syllabi"]);
	}, butdelay);
});
$("#rateMyProf").click(function () {
	setTimeout(function () {
		window.open(curr_course["links"]["rate_my_prof"]);
	}, butdelay);
});
$("#eCIS").click(function () {
	setTimeout(function () {
		window.open(curr_course["links"]["ecis"]);
	}, butdelay);
});
$("#textbook").click(function () {
	setTimeout(function () {
		window.open(curr_course["links"]["textbook"]);
	}, butdelay);
});
$("#semesters").on('change', function () {
	var sem = $(this).val();
	sem = sem == "Aggregate" ? undefined : sem;
	getDistribution(curr_course, sem);
});

$("#retry").click(function () {
	$("#retrylabel").hide();
	$(this).hide();
	loadNextPages();
});




$(document).keydown(function (e) {
	/*Close Modal when hit escape*/
	if (e.keyCode == 27) {
		close();
	} else if (e.keyCode == 13 && $('#myModal').is(':visible')) {
		saveCourse();
	}
});

/*Listen for update mssage coming from popup*/
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.command == "updateCourseList") {
			update(0);
		}
	}
);


function sepNameParts(name) {
	numIndex = name.search(/\d/);
	department = name.substring(0, numIndex).trim();
	number = name.substring(numIndex, name.indexOf(" ", numIndex)).trim();
	name = capitalizeString(name.substring(name.indexOf(" ", numIndex)).trim());
	return [name, department, number];
}

function updateLinks(course_info, first_name) {
	let {
		prof_name,
		number
	} = course_info;
	course_info["first_name"] = first_name;
	course_info["links"]["rate_my_prof"] = `http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+texas+at+austin&queryoption=HEADER&query=${first_name} ${prof_name};&facetSearch=true`;
	course_info["links"]["ecis"] = profname ? `http://utdirect.utexas.edu/ctl/ecis/results/index.WBX?&s_in_action_sw=S&s_in_search_type_sw=N&s_in_search_name=${prof_name}%2C%20${first_name}` :
		`http://utdirect.utexas.edu/ctl/ecis/results/index.WBX?s_in_action_sw=S&s_in_search_type_sw=C&s_in_max_nbr_return=10&s_in_search_course_dept=${department}&s_in_search_course_num=${number}`;
}


function buildCourseLinks(course_info) {
	let {
		department,
		number,
		unique,
		prof_name
	} = course_info
	links = {
		"textbook": `https://www.universitycoop.com/adoption-search-results?sn=${semesterCode}__${department}__${number}__${unique}`,
		"syllabi": `https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?semester=&department=${department}&course_number=${number}&course_title=&unique=&instructor_first=&instructor_last=${prof_name}&course_type=In+Residence&search=Search`,
		//default ones (before first name can be used)
		"rate_my_prof": "http://www.ratemyprofessors.com/campusRatings.jsp?sid=1255",
		"ecis": "http://utdirect.utexas.edu/ctl/ecis/results/index.WBX?"
	}
	course_info["links"] = links;
	return course_info;
}

function buildBasicCourseInfo(row, course_name, individual) {
	let namedata = sepNameParts(course_name)
	let instructor_text = $(row).find('td[data-th="Instructor"]').text();
	let has_initial = instructor_text.indexOf(',') > 0;
	course_info = {
		"full_name": course_name,
		"name": namedata[0],
		"department": namedata[1],
		"number": namedata[2],
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
	return buildCourseLinks(course_info);
}

/*For a row, get all the course information and add the date-time-lines*/
function getCourseInfo(row) {
	let course_name = "";
	let course_row = {}
	let individual = undefined;
	if ($("#textbook_button").length) {
		course_name = $("#details h2").text();
		course_row = $('table');
		individual = document.URL;
	} else {
		$('table').find('tr').each(function () {
			if ($(this).find('td').hasClass("course_header")) {
				course_name = $(this).find('td').text() + "";
			}
			if ($(this).is(row)) {
				course_row = row;
				return false;
			}
		});
	}
	curr_course = buildBasicCourseInfo(course_row, course_name, individual);
	getDescription(curr_course);
	return curr_course;
}


function toggleLoadingPage(loading) {
	if (loading) {
		$('#loader').css('display', 'inline-block');
		$("#nextlabel").css('display', 'inline-block');
	} else {
		$('#loader').hide();
		$("#nextlabel").hide();
	}
}

function loadNextPages() {
	chrome.storage.sync.get('loadAll', function (data) {
		if (data.loadAll) {
			let link = next.prop('href');
			if (doneLoading && next && link) {
				toggleLoadingPage(true);
				doneLoading = false;
				$.get(link, function (response) {
					if (response) {
						var nextpage = $('<div/>').html(response).contents();
						var current = $('tbody');
						var oldlength = $('tbody tr').length;
						var last = current.find('.course_header>h2:last').text();
						next = nextpage.find("#next_nav_link");
						doneLoading = true;
						$("#nextlabel").hide();
						$('#loader').hide();
						var newrows = [];
						nextpage.find('tbody>tr').each(function () {
							let hasCourseHead = $(this).find('td').hasClass("course_header");
							if (!(hasCourseHead && $(this).has('th').length == 0))
								$(this).append(`<td data-th="Plus"><input type="image" class="distButton" id="distButton" style="vertical-align: bottom;" width="20" height="20" src='${chrome.extension.getURL('images/disticon.png')}'/></td>`);
							if (!(hasCourseHead && last == $(this).find('td').text()))
								newrows.push($(this));
						});
						current.append(newrows);
						update(oldlength + 1)
					}
				}).fail(function () {
					doneLoading = true;
					toggleLoadingPage(false);
					$("#retrylabel").css('display', 'inline-block');
					$('#retry').css('display', 'inline-block');
				});
			}
		}
	});
}

function saveCourse() {
	let {
		full_name,
		unique,
		prof_name,
		status,
		individual,
		register
	} = curr_course;
	let dtarr = getDayTimeArray(undefined, curr_course);

	var c = new Course(full_name, unique, prof_name, dtarr, status, individual, register);
	chrome.runtime.sendMessage({
		command: "courseStorage",
		course: c,
		action: $("#saveCourse").text().substring(0, $("#saveCourse").text().indexOf(" ")).toLowerCase()
	}, function (response) {
		$("#saveCourse").text(response.label);
		$("#snackbar").text(response.done);
		toggleSnackbar();
		chrome.runtime.sendMessage({
			command: "updateCourseList"
		});
	});
}


function toggleSnackbar() {
	setTimeout(function () {
		$("#snackbar").attr("class", "show");
	}, 200);
	setTimeout(function () {
		$("#snackbar").attr("class", "");
	}, 3000);
}

/* Update the course list to show if the row contains a course that conflicts with the saved course is one of the saved courses */
function update(start) {
	chrome.storage.sync.get('courseConflictHighlight', function (data) {
		let canHighlight = data.courseConflictHighlight;
		$('table').find('tr').each(function (i) {
			if (i >= start) {
				if (!($(this).find('td').hasClass("course_header")) && $(this).has('th').length == 0) {
					var thisForm = this;
					var uniquenum = $(this).find('td[data-th="Unique"]').text();
					chrome.runtime.sendMessage({
						command: "isSingleConflict",
						dtarr: getDayTimeArray(this),
						unique: uniquenum
					}, function (response) {
						let {
							isConflict,
							alreadyContains
						} = response
						updateTextHighlighting($(thisForm).find('td'), canHighlight, isConflict, alreadyContains);
					});
				}
			}
		});
	});
}

function updateTextHighlighting(tds, canHighlight, isConflict, alreadyContains) {
	if (isConflict && canHighlight && !alreadyContains) {
		if (tds.css('color') != 'rgb(244, 67, 54)')
			tds.css('color', '#F44336').css('text-decoration', 'line-through').css('font-weight', 'normal');
	} else if (!alreadyContains) {
		if (tds.css('color') != 'rgb(51, 51, 51)')
			tds.css('color', 'black').css('text-decoration', 'none').css('font-weight', 'normal');
	}
	if (alreadyContains) {
		if (tds.css('color') != 'rgb(76, 175, 80)')
			tds.css('color', '#4CAF50').css('text-decoration', 'none').css('font-weight', 'bold');
	}
}


/* For a row, get the date-time-array for checking conflicts*/
function getDayTimeArray(row, course_info) {
	var daytimearray = []
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
				daytimearray.push(["TH", convertTime(time), place]);
			} else {
				if (letter != "H")
					daytimearray.push([letter, convertTime(time), place]);
			}
		}
	}
	return daytimearray;
}

function makeLine(date, time, place) {
	var arr = seperateDays(date)
	var output = prettifyDaysText(arr)
	var building = place.substring(0, place.search(/\d/) - 1);
	building = building == "" ? "Undecided Location" : building;
	return `${output} at ${time.replace(/\./g, '').replace(/\-/g, ' to ')} in <a style='font-size:medium' target='_blank' href='https://maps.utexas.edu/buildings/UTM/${building}'>${building}</>`;
}

function badData(course_data, res) {
	return typeof res == 'undefined' || course_data["prof_name"] == "Undecided";
}

/*Query the grades database*/
function getDistribution(course_data, sem) {
	// showLoading(true);
	let query = buildQuery(course_data, sem);
	chrome.runtime.sendMessage({
		command: "gradesQuery",
		query: query
	}, function (response) {
		var res = response.data;
		if (!sem) {
			openDialog(course_data, res);
		} else {
			var data = badData(course_data, res) ? [] : res.values[0];
			setChart(data);
		}
	});
}

function buildTitle(course_data) {
	return `${course_data["name"]} (${course_data["department"]} ${course_data["number"]})`
}

function buildTimeTitle(course_info) {
	$("h2.dateTimePlace").remove();
	let {
		days,
		times,
		places
	} = course_info["time_data"]
	datetimearr = [];
	var lines = [];
	for (var i = 0; i < days.length; i++) {
		var date = days[i];
		var time = times[i];
		var place = places[i];
		lines.push($(`<h2 class="dateTimePlace">${makeLine(date, time, place)}</th>`));
	}
	return lines;
}

function buildProfTitle(course_data) {
	const {
		initial,
		prof_name
	} = course_data;
	return `with ${initial?initial+". ":""}${prof_name}`;
}


function buildSemestersDropdown(course_data, res) {
	$("#semesters").empty();
	if (badData(course_data, res)) {
		$("#semesters").append("<option>No Data</option>")
	} else {
		var semesters = res.values[0][18].split(",");
		semesters.sort(semesterSort);
		semesters.reverse().unshift('Aggregate');
		var sems = [];
		for (var i = 0; i < semesters.length; i++) {
			sems.push($(`<option value="${semesters[i]}">${semesters[i]}</option>`));
		}
		$("#semesters").append(sems);
	}
}


/*Open the modal and show all the data*/
function openDialog(course_info, res) {
	$("#title").text(buildTitle(course_info))
	$("#topbuttons").before(buildTimeTitle(course_info));
	$("#profname").text(buildProfTitle(course_info));
	$("#myModal").fadeIn(fadetime);
	//initial text on the "save course button"
	chrome.runtime.sendMessage({
		command: "alreadyContains",
		unique: course_info["unique"]
	}, function (response) {
		if (response.alreadyContains) {
			$("#saveCourse").text("Remove Course -");
		} else {
			$("#saveCourse").text("Add Course +");
		}
	});

	buildSemestersDropdown(course_info, res)
	var data = []
	if (!badData(course_info, res))
		data = res.values[0];
	let status_color = getStatusColor(course_info["status"]);
	//close button
	allowClosing();
	setChart(data);

}



function setChart(data) {
	// set up the chart
	Highcharts.chart('chart', buildChartConfig(data), function (chart) { // on complete
		if (data.length == 0) {
			//if no data, then show the message and hide the series
			chart.renderer.text('Could not find data for this Instructor teaching this Course.', 100, 120)
				.css({
					fontSize: '20px',
					width: '300px',
					align: 'center',
					left: '160px'
				})
				.add();
			$.each(chart.series, function (i, ser) {
				ser.hide();
			});
		}
	});
}

function buildFormattedDescription(description_lines) {
	let description = ""
	for (let i in description_lines) {
		let sentence = description_lines[i];
		if (sentence.indexOf("Prerequisite") == 0)
			sentence = `<li style='font-weight: bold;' class='descriptionli'>${sentence}</li>`;
		else if (sentence.indexOf("May be") >= 0)
			sentence = `<li style='font-style: italic;' class='descriptionli'>${sentence}</li>`;
		else if (sentence.indexOf("Restricted to") == 0)
			sentence = `<li style='color:red;' class='descriptionli'>${sentence}</li>`;
		else
			sentence = `<li class='descriptionli'>${sentence}</li>`;
		description += sentence;
	}
	if (!description)
		description = "<p style='color:red;font-style:bold'>There was an error. Please refresh the page and/or log back in using your UT EID and password.</p>"
	return description;
}




function extractFirstName(response_node) {
	let full_name = response_node.find('td[data-th="Instructor"]').text().split(', ');
	let first = full_name[full_name.length - 1];
	first = first.indexOf(' ') > 0 ? first.split(' ')[0] : first;
	return capitalizeString(first);
}

function displayDescription(description) {
	$("#description").animate({
		'opacity': 0
	}, 200, function () {
		$(this).html(description).animate({
			'opacity': 1
		}, 200);
	});
}

/*Get the course description from the profurl and highlight the important elements, as well as set the eCIS, and rmp links.*/
function getDescription(course_info) {
	console.log('getting description for ')
	$.ajax({
		url: course_info["individual"],
		success: function (response) {
			if (response) {
				response_node = $('<div/>').html(response).contents();
				description_lines = response_node.find('#details > p').toArray().map(x => $(x).text());
				displayDescription(buildFormattedDescription(description_lines));
				let first_name = extractFirstName(response_node);
				updateLinks(course_info, first_name);
			} else {
				description = "<p style='color:red;font-style:bold'>You have been logged out. Please refresh the page and log back in using your UT EID and password.</p>"
				displayDescription(description);
			}
		}
	});
}

function allowClosing() {
	$('.close').click(function () {
		close();
	});
	$('#myModal').click(function (event) {
		if (event.target.id == 'myModal') {
			close();
		}
	});

}

function close() {
	$("#myModal").fadeOut(fadetime);
	$("#snackbar").attr("class", "");
}