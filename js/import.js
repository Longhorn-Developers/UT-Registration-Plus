var link;
$(function () {
	//template https://utdirect.utexas.edu/apps/registrar/course_schedule/20189/51475/
	var sem = $('[name="s_ccyys"]').val();
	$("[href='#top']").before("<button class='matbut' id='import' style='margin:10px 0px 20px 0px;'><span style='font-size:small'>Import into </span><b>UT Reg Plus<b></h2></button><br>");
	$("#import").prepend("<div id='snackbar'>defaultmessage..</div>");
	$("#import").click(function(){
		$(".tbg").last().find(".tbon>td:first-child").each(function(){
			let unique = $(this).text().replace(/\s/g, '');
			link = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${sem}/${unique}/`;
			getInfo();
		});
	});

});

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


function getInfo(classurl){
	chrome.runtime.sendMessage({
		method: "GET",
		action: "xhttp",
		url: link,
		data: ""
	}, function (response) {
		if (response) {
			var output = "";
			var object = $('<div/>').html(response).contents();
			var c = getCourseObject(object);
			chrome.runtime.sendMessage({
				command: "alreadyContains",
				unique: c.unique
			}, function (response) {
				if (!response.alreadyContains) {
					saveCourse(c);
				}
			});
		//	var first = object.find('td[data-th="Instructor"]').text();
	} else {

	}
});
}


/*For a row, get all the course information and add the date-time-lines*/
function getCourseObject(object) {
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
	return new Course(coursename,uniquenum,profname,datetimearr,status,indlink,registerlink);
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

function saveCourse(course){
	chrome.runtime.sendMessage({
		command: "courseStorage",	
		course: course,
		action: "add"
	}, function (response) {
		$("#import").text("Courses Saved!");
		chrome.runtime.sendMessage({
			command: "updateCourseList"
		});
	});
}

