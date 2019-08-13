console.log(`UT Registration Plus is running on this page: ${window.location.href}`);

var curr_course = {}


var semester_code = new URL(window.location.href).pathname.split('/')[4];
var done_loading = true;
updateListConflictHighlighting();



var next = $("#next_nav_link");
if (next) {
	chrome.storage.sync.get('loadAll', function (data) {
		if (data.loadAll)
			$('[title*="next listing"]').remove();
	});
}

//This extension may be super lit, but you know what's even more lit?
//Matthew Tran's twitter and insta: @MATTHEWTRANN and @matthew.trann

$(window).scroll(function () {
	if ($(document).height() <= $(window).scrollTop() + $(window).height() + 150)
		loadNextPages();
});


if (document.querySelector('#fos_fl')) {
	let params = (new URL(document.location)).searchParams;
	let dep = params.get("fos_fl");
	let level = params.get("level");
	if (dep && level) {
		if (dep.length == 3 && (level == 'U' || level == 'L' || level == 'G')) {
			document.querySelector('#fos_fl').value = dep;
			document.querySelector('#level').value = level;
		}
	}
}

//make heading and modal
if (!$("#kw_results_table").length) {
	$("table").after(Template.Catalog.loading());
	$("#container").prepend(Template.Main.modal());
	$("#myModal").prepend("<div id='snackbar'>save course popup...</div>");

	// now add to the table 
	$("table thead th:last-child").after('<th scope=col>Plus</th>');
	$('table').find('tr').each(function () {
		if (!($(this).find('td').hasClass("course_header")) && $(this).has('th').length == 0) {
			$(this).append(Template.Main.extension_button());
		}
	});
}



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
		"textbook": `https://www.universitycoop.com/adoption-search-results?sn=${semester_code}__${department}__${number}__${unique}`,
		"syllabi": `https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?semester=&department=${department}&course_number=${number}&course_title=&unique=&instructor_first=&instructor_last=${prof_name}&course_type=In+Residence&search=Search`,
		//default ones (before first name can be used)
		"rate_my_prof": "http://www.ratemyprofessors.com/campusRatings.jsp?sid=1255",
		"ecis": "http://utdirect.utexas.edu/ctl/ecis/results/index.WBX?"
	}
	course_info["links"] = links;
	return course_info;
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

function saveCourse() {
	console.log(curr_course);
	console.log(JSON.stringify(curr_course));
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

/* Update the course list to show if the row contains a course that conflicts with the saved course is one of the saved courses */
function updateListConflictHighlighting(start = 0) {
	chrome.storage.sync.get('courseConflictHighlight', function (data) {
		let canHighlight = data.courseConflictHighlight;
		$('table').find('tr').each(function (i) {
			if (i >= start) {
				if (!($(this).find('td').hasClass("course_header")) && $(this).has('th').length == 0) {
					var unique = $(this).find('td[data-th="Unique"]').text();
					chrome.runtime.sendMessage({
						command: "isSingleConflict",
						dtarr: getDayTimeArray(this),
						unique: unique
					}, (response) => {
						let {
							isConflict,
							alreadyContains
						} = response
						updateTextHighlighting($(this).find('td'), canHighlight, isConflict, alreadyContains);
					});
				}
			}
		});
	});
}

function updateTextHighlighting(tds, canHighlight, isConflict, alreadyContains) {
	let current_color = rgb2hex(tds.css('color'));
	if (isConflict && canHighlight && !alreadyContains) {
		if (current_color != Colors.highlight_conflict)
			tds.css('color', Colors.highlight_conflict).css('text-decoration', 'line-through').css('font-weight', 'normal');
	} else if (!alreadyContains) {
		if (tds.css('color') != Colors.highlight_default)
			tds.css('color', Colors.highlight_default).css('text-decoration', 'none').css('font-weight', 'normal');
	}
	if (alreadyContains) {
		if (tds.css('color') != Colors.highlight_saved)
			tds.css('color', Colors.highlight_saved).css('text-decoration', 'none').css('font-weight', 'bold');
	}
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

function convertDateTimeArrToLine(date, time, place) {
	let arr = seperateDays(date)
	let output = prettifyDaysText(arr)
	let building = place.substring(0, place.search(/\d/) - 1);
	building = building == "" ? "Undecided Location" : building;
	return `${output} at ${time.replace(/\./g, '').replace(/\-/g, ' to ')} in <a style='font-size:medium' target='_blank' href='https://maps.utexas.edu/buildings/UTM/${building}'>${building}</>`;
}

function badData(course_data, res) {
	return typeof res == 'undefined' || course_data["prof_name"] == "Undecided";
}

/*Query the grades database*/
function getDistribution(course_data, sem) {
	toggleChartLoading(true);
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
	var lines = [];
	for (let i = 0; i < days.length; i++) {
		var date = days[i];
		var time = times[i];
		var place = places[i];
		lines.push($(`<h2 class="dateTimePlace">${convertDateTimeArrToLine(date, time, place)}</th>`));
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
	$("#myModal").fadeIn(Timing.fade_time);
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
	toggleChartLoading(false);
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

var error_message = "<p style='color:red;font-style:bold'>You have been logged out. Please refresh the page and log back in using your UT EID and password.</p>";

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
		description = error_message;
	return description;
}

function extractFirstName(response_node) {
	let full_name = response_node.find('td[data-th="Instructor"]').text().split(', ');
	let first = full_name[full_name.length - 1];
	first = first.indexOf(' ') > 0 ? first.split(' ')[0] : first;
	return capitalizeString(first);
}

function displayDescription(description) {
	toggleDescriptionLoading(false);
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
	toggleDescriptionLoading(true);
	$.ajax({
		url: course_info["individual"],
		success: function (response) {
			if (response) {
				let response_node = htmlToNode(response);
				description_lines = response_node.find('#details > p').toArray().map(x => $(x).text());
				displayDescription(buildFormattedDescription(description_lines));
				let first_name = extractFirstName(response_node);
				updateLinks(course_info, first_name);
			} else {
				displayDescription(error_message);
			}
		}
	});
}

function loadNextPages() {
	chrome.storage.sync.get('loadAll', function (data) {
		if (data.loadAll) {
			let link = next.prop('href');
			if (done_loading && next && link) {
				toggleLoadingPage(true);
				$.get(link, function (response) {
					if (response) {
						var next_page = htmlToNode(response);
						var current = $('tbody');
						var old_length = $('tbody tr').length;
						var last = current.find('.course_header>h2:last').text();
						next = next_page.find("#next_nav_link");
						toggleLoadingPage(false);
						var new_rows = [];
						next_page.find('tbody>tr').each(function () {
							let has_course_header = $(this).find('td').hasClass("course_header");
							if (!(has_course_header && $(this).has('th').length == 0))
								$(this).append(Template.Main.extension_button());
							if (!(has_course_header && last == $(this).find('td').text()))
								new_rows.push($(this));
						});
						current.append(new_rows);
						updateListConflictHighlighting(old_length + 1)
					}
				}).fail(function () {
					toggleLoadingPage(false);
					$("#retrylabel").css('display', 'inline-block');
					$('#retry').css('display', 'inline-block');
				});
			}
		}
	});
}

$("#myModal").on('click', '#saveCourse', function () {
	setTimeout(function () {
		saveCourse();
	}, 0);
});

$("#Syllabi").click(function () {
	setTimeout(function () {
		window.open(curr_course["links"]["syllabi"]);
	}, Timing.button_delay);
});
$("#rateMyProf").click(function () {
	setTimeout(function () {
		window.open(curr_course["links"]["rate_my_prof"]);
	}, Timing.button_delay);
});
$("#eCIS").click(function () {
	setTimeout(function () {
		window.open(curr_course["links"]["ecis"]);
	}, Timing.button_delay);
});
$("#textbook").click(function () {
	setTimeout(function () {
		window.open(curr_course["links"]["textbook"]);
	}, Timing.button_delay);
});
$("#semesters").on('change', function () {
	let sem = $(this).val();
	sem = sem == "Aggregate" ? undefined : sem;
	getDistribution(curr_course, sem);
});

$("#retry").click(function () {
	$("#retrylabel").hide();
	$(this).hide();
	loadNextPages();
});

/*Listen for update mssage coming from popup*/
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.command == "updateCourseList") {
			updateListConflictHighlighting(0);
		}
	}
);


function toggleLoadingPage(loading) {
	if (loading) {
		done_loading = false;
		$('#loader').css('display', 'inline-block');
		$("#nextlabel").css('display', 'inline-block');
	} else {
		done_loading = true;
		$('#loader').hide();
		$("#nextlabel").hide();
	}
}

function toggleChartLoading(loading) {
	if (loading) {
		$('#chartload').css('display', 'inline-block');
		$("#chart").hide();
	} else {
		$('#chartload').hide();
		$("#chart").show();
	}
}

function toggleDescriptionLoading(loading) {
	if (loading) {
		$('#descload').css('display', 'inline-block');
	} else {
		$('#descload').hide();
	}
}

function toggleSnackbar() {
	setTimeout(function () {
		$("#snackbar").attr("class", "show");
	}, 200);
	setTimeout(function () {
		$("#snackbar").attr("class", "");
	}, 3000);
}

$(document).keydown(function (e) {
	/*Close Modal when hit escape*/
	if (e.keyCode == 27) {
		close();
	} else if (e.keyCode == 13 && $('#myModal').is(':visible')) {
		saveCourse();
	}
});


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
	$("#myModal").fadeOut(Timing.fade_time);
	$("#snackbar").attr("class", "");
}