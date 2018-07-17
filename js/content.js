var grades;
var rmpLink;
var eCISLink;
var coursename;
var profname;
var profinit;
var uniquenum;
var profurl;
var department;
var course_nbr;
var datetimearr = [];
var chart;
var description;
var status;

const days = new Map([["M" ,"Monday"], 
	["T", "Tuesday"], ["W", "Wednesday"],["TH" ,"Thursday"], 
	["F", "Friday"]]);
const fadetime = 150;
const butdelay = 100;

$(document).ready( function() {
	loadDataBase();
	//make heading and modal
	$("table thead th:last-child").after('<th scope=col>Plus</th>');
	var modhtml ='<div class=modal id=myModal><div class=modal-content><span class=close>×</span><div class=card><div class=cardcontainer><h2 class=title id="title">Computer Fluency (C S 302)</h2><h2 class=profname id="profname">with Bruce Porter</h2><div id="topbuttons" class=topbuttons><button class=matbut id="rateMyProf" style="background: #4CAF50;"> RMP </button><button class=matbut id="eCIS" style="background: #CDDC39;"> eCIS </button><button class=matbut id="Syllabi"> Past Syllabi </button><button class=matbut id="saveCourse" style="background: #F44336;"> Save Course +</button></div></div></div><div class=card><div class=cardcontainer style=""><ul class=description id="description" style="list-style-type:disc"></ul></div></div><div class=card ><div id="chartcontainer" class=cardcontainer><div id=chart></div></div></div></div>';
	$("#container").prepend(modhtml);
	$("#myModal").prepend("<div id='snackbar'>defaultmessage..</div>");
	//go through all the rows in the list
	$('table').find('tr').each(function(){
		if(!($(this).find('td').hasClass("course_header")) && $(this).has('th').length == 0){
	    	//if a course row, then add the extension button and do something if that course has been "saved"
	    	var thisForm = this;
	    	$(this).append('<td data-th="Plus"><input type="image" class="distButton" id="distButton" style="vertical-align: bottom; display:block;" width="20" height="20" src='+chrome.extension.getURL('images/disticon.png')+' /></td>');
	    	var uniquenum = $(this).find('td[data-th="Unique"]').text();
	    	chrome.runtime.sendMessage({command: "isSingleConflict",dtarr: getDtarr(this),unique:uniquenum}, function(response) {
	    		if(response.isConflict){
					$(thisForm).find('td').each(function(){
		    			$(this).css('color','#F44336');
		    			$(this).css('text-decoration','line-through');
		    			$(this).css('font-weight','normal');	    			
		    		});
				} 
				else {
					$(thisForm).find('td').each(function(){
		    			$(this).css('color','black');
		    			$(this).css('text-decoration','none');
		    			$(this).css('font-weight','normal');	    			
		    		});
				}
				if(response.alreadyContains){
					$(thisForm).find('td').each(function(){
		    			$(this).css('color','#4CAF50');
		    			$(this).css('text-decoration','none');
		    			$(this).css('font-weight','bold');
		    		});
				}
			});
	    }
	});
	/*Handle the button clicks*/
	$(".distButton").click(function(){
		var row = $(this).closest('tr');
		getCourseInfo(row);
		getDistribution();
	});

	$("#saveCourse").click(function(){
		var c = new Course(coursename,uniquenum, profname, datetimearr, status, profurl);
		chrome.runtime.sendMessage({command: "courseStorage",course: c, action:$("#saveCourse").text().substring(0,$("#saveCourse").text().indexOf(" ")).toLowerCase()}, function(response) {
			$("#saveCourse").text(response.label);
			$("#snackbar").text(response.done);
			$("#snackbar").attr("class","show");
			setTimeout(function(){$("#snackbar").attr("class","");}, 3000);
			setTimeout(update(), 1000);
		});
	});

	$("#Syllabi").click(function(){
		setTimeout(function(){	
			window.open('https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?semester=&department='+department+'&course_number='+course_nbr+'&course_title=&unique=&instructor_first=&instructor_last='+profname+'&course_type=In+Residence&search=Search');
		}, butdelay);
	});
	$("#rateMyProf").click(function(){
		setTimeout(function(){
			window.open(rmpLink);
		}, butdelay);
	});
	$("#eCIS").click(function(){
		setTimeout(function(){
			window.open(eCISLink);
		}, butdelay);
	});
	/*Close Modal when hit escape*/
	$(document).keydown(function(e) { 
		if (e.keyCode == 27) { 
			$("#myModal").fadeOut(fadetime);
		}
		$("#snackbar").attr("class",""); 
	});
	/*Listen for update mssage coming from popup*/
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.command == "update"){
				update();
			}
		});
});

/* Update the course list to show if the row contains a course that conflicts with the saved course is one of the saved courses */
function update(){
	$('table').find('tr').each(function(){
		if(!($(this).find('td').hasClass("course_header")) && $(this).has('th').length == 0){
	    	var thisForm = this;
	    	var uniquenum = $(this).find('td[data-th="Unique"]').text();
	    	chrome.runtime.sendMessage({command: "isSingleConflict",dtarr: getDtarr(this),unique:uniquenum}, function(response) {
	    		if(response.isConflict){
					$(thisForm).find('td').each(function(){
		    			$(this).css('color','#F44336');
		    			$(this).css('text-decoration','line-through');
		    			$(this).css('font-weight','normal');	    			
		    		});
				} 
				else {
					$(thisForm).find('td').each(function(){
		    			$(this).css('color','black');
		    			$(this).css('text-decoration','none');
		    			$(this).css('font-weight','normal');	    			
		    		});
				}
				if(response.alreadyContains){
					$(thisForm).find('td').each(function(){
		    			$(this).css('color','#4CAF50');
		    			$(this).css('text-decoration','none');
		    			$(this).css('font-weight','bold');
		    		});
				}
			});
	    }
	});
}

/* For a row, get the date-time-array for checking conflicts*/
function getDtarr(row){
	var numlines = $(row).find('td[data-th="Days"]>span').length;
	var dtarr = [];
	for(var i=0; i<numlines;i++){
		var date = $(row).find('td[data-th="Days"]>span:eq('+i+')').text();
		var time = $(row).find('td[data-th="Hour"]>span:eq('+i+')').text();
		var place = $(row).find('td[data-th="Room"]>span:eq('+i+')').text();
		for(var j = 0; j<date.length;j++){
			var letter = date.charAt(j);
			var day = "";
			if(letter == "T" && j <date.length-1 && date.charAt(j+1) == "H"){
				dtarr.push(["TH", convertTime(time),place]);
			}
			else {
				if(letter != "H"){
					dtarr.push([letter, convertTime(time),place]);
				}
			}
		}
	}
	return dtarr;
}

/*Course object for passing to background*/
function Course(coursename, unique, profname,datetimearr, status, link){
	this.coursename = coursename;
	this.unique = unique;
	this.profname = profname;
	this.datetimearr = datetimearr;
	this.status = status;
	this.link = link;
}

/*For a row, get all the course information and add the date-time-lines*/
function getCourseInfo(row){
	$(".dateTimePlace").remove();
	$('table').find('tr').each(function(){
		if($(this).find('td').hasClass("course_header")){
			coursename = $(this).find('td').text() + "";
		}
		if($(this).is(row)){
			profurl = $(this).find('td[data-th="Unique"] a').prop('href');
			uniquenum = $(this).find('td[data-th="Unique"]').text();
			status = $(this).find('td[data-th="Status"]').text();
			profname = $(this).find('td[data-th="Instructor"]').text().split(', ')[0];
			profinit = $(this).find('td[data-th="Instructor"]').text().split(', ')[1];
			if(profname.indexOf(" ") == 0){
				profname = profname.substring(1);
			}
			var numlines = $(this).find('td[data-th="Days"]>span').length;
			datetimearr = [];
			for(var i=0; i<numlines;i++){
				var date = $(this).find('td[data-th="Days"]>span:eq('+i+')').text();
				var time = $(this).find('td[data-th="Hour"]>span:eq('+i+')').text();
				var place = $(this).find('td[data-th="Room"]>span:eq('+i+')').text();
				$("#topbuttons").before('<h2 class="dateTimePlace">'+makeLine(date,time,place)+'</th>');
		}
		return false;
	}
});
	/*Handle if on the individual course page*/
	if(typeof coursename == 'undefined'){
		coursename = $("#details h2").text();
		profinit = profinit.substring(0,1);
		profurl = document.URL;
	}
	getDescription();
	department = coursename.substring(0,coursename.search(/\d/)-2);
	course_nbr = coursename.substring(coursename.search(/\d/),coursename.indexOf(" ",coursename.search(/\d/)));
}

/* Make the day-time-arr and make the text for the date-time-line*/
function makeLine(date, time, place){
	var arr = [];
	var output = "";
	for(var i = 0; i<date.length;i++){
		var letter = date.charAt(i);
		var day = "";
		if(letter == "T" && i <date.length-1 && date.charAt(i+1) == "H"){
			arr.push(days.get("TH"));
			datetimearr.push(["TH", convertTime(time),place]);
		}
		else {
			if(letter != "H"){
				arr.push(days.get(letter));
				datetimearr.push([letter, convertTime(time),place]);
			}
		}
	}
	if(arr.length > 2){
		for(var i = 0; i<arr.length;i++){
			if(i < arr.length-1){
				output+=arr[i]+", "
			}
			if(i == arr.length-2){
				output+= "and ";
			}
			if(i == arr.length-1){
				output+=arr[i];
			}
		}
	}
	else if(arr.length == 2){
		output = arr[0]+" and "+arr[1];
	}
	else{
		output+=arr[0];
	}
	var building = place.substring(0,place.search(/\d/)-1);
	if(building == ""){
		building = "Undecided Location";
	}
	return output + " at "+time.replace(/\./g,'').replace(/\-/g,' to ')+" in "+"<a style='font-size:medium' target='_blank' href='"+"https://maps.utexas.edu/buildings/UTM/"+building+"''>"+building+"</>";
}

/*Convert time to 24hour format*/
function convertTime(time){
	var converted = time.replace(/\./g,'').split("-");
	for(var i = 0; i<2;i++){
		converted[i] = moment(converted[i], ["h:mm A"]).format("HH:mm");
	}
	return converted;
}

/*Query the grades database*/
function getDistribution(){
	var query = "select * from agg";
	query += " where dept like '%"+department+"%'";
	query += " and prof like '%"+profname.replace(/'/g, "")+"%'";
	query += " and course_nbr like '%"+course_nbr+"%'";
	query += "order by a1+a2+a3+b1+b2+b3+c1+c2+c3+d1+d2+d3+f desc";
	var res = grades.exec(query)[0];
	var output = "";
	openDialog(department,coursename,"aggregate",profname,res);
}

/*Open the modal and show all the data*/
function openDialog(dep,cls,sem,professor,res){
	$("#myModal").fadeIn(fadetime);
	//initial text on the "save course button"
	chrome.runtime.sendMessage({command: "alreadyContains",unique: uniquenum}, function(response) {
		if(response.alreadyContains){
			$("#saveCourse").text("Remove Course -");
		} 
		else{
			$("#saveCourse").text("Add Course +");
		}
	});
	//set if no grade distribution
	var data;
	if(typeof res == 'undefined'){
		data = [];
	}
	else{
		data = res.values[0];
	}
	//if undefined professor, then pick the distribution for the prof with the largest number of overall student entries
	var title = null
	if(profname == "" && typeof res != 'undefined'){
		title = res.values[0][1];
	}
	var modal = document.getElementById('myModal');
	var span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";

	$("#title").text(prettifyTitle());
	var color = "black";
	if(status.includes("open")){
		color = "#4CAF50";
	}
	else if(status.includes("waitlisted")){
		color = "#FF9800"
	}
	else if(status.includes("closed") || status.includes("cancelled")){
		color = "#F44336";
	}
	$("#title").append("<span style='color:"+color+";font-size:medium;'>"+" #"+uniquenum+"</>");

	var name;
	if(profname == ""){
		name = "Undecided Professor ";
	}
	else{
		name = profinit+". "+profname.substring(0,1)+profname.substring(1).toLowerCase();
	}
	$("#profname").text("with "+ name);
	//close button
	span.onclick = function() {
		$("#myModal").fadeOut(200);
		$("#snackbar").attr("class","");
	}
	//set up the chart 
	chart = Highcharts.chart('chart', {
		chart: {
			type: 'column',
			backgroundColor: ' #fefefe',
			spacingLeft: 10
		},
		title: {
			text: null
		},
		subtitle: {
			text: title
		},
		legend: {
			enabled: false
		},
		xAxis: {
			title: {
				text: 'Grades' 
			},
			categories: [
			'A',
			'A-',
			'B+',
			'B',
			'B-', 
			'C+', 
			'C', 
			'C-',
			'D+', 
			'D',
			'D-',
			'F'
			],
			crosshair: true
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Students'
			}
		},
		credits: {
			enabled: false
		},
		lang: {
			noData: "The professor hasn't taught this class :("
		},
		tooltip: {
			headerFormat: '<span style="font-size:small; font-weight:bold">{point.key}</span><table>',
			pointFormat: '<td style="color:{black};padding:0;font-size:small; font-weight:bold;"><b>{point.y:.0f} Students</b></td>',
			footerFormat: '</table>',
			shared: true,
			useHTML: true
		},
		plotOptions: {
			bar: {
				pointPadding: 0.2,
				borderWidth: 0
			},
			series: {
				animation: {
					duration: 700
				}
			}
		},
		series: [{
			name: 'Grades',
			data: [{y: data[6], color: '#4CAF50'}, {y: data[7], color: '#8BC34A'}, {y: data[8], color: '#CDDC39'}, {y: data[9], color: '#FFEB3B'}, {y: data[10], color: '#FFC107'}, {y: data[11], color: '#FFA000'}, {y: data[12], color: '#F57C00'}, {y: data[13], color: '#FF5722'}, {y: data[14], color: '#FF5252'}, {y: data[15], color: '#E64A19'}, {y: data[16], color: '#F44336'}, {y: data[17], color: '#D32F2F'}]
		}]
	}, function(chart) { // on complete
	if(data.length == 0){
		//if no data, then show the message and hide the series
		chart.renderer.text('Could not find distribution for this Instructor teaching this Course', 100, 120)
		.css({
			fontSize: '20px',
			align:'center',
			width: '300px',
			left:'160px'
		})
		.add();
		$.each(chart.series, function(i, ser) {
			ser.hide();
		});
	}

});	// When clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			$("#myModal").fadeOut(fadetime);
			$("#snackbar").attr("class",""); 
		}
	}	
}

/*Format the title*/
function prettifyTitle(){
	val = department.length+course_nbr.length+3;
	output = coursename.substring(val).replace(/\b\w*/g, function(txt){
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
	return output + " ("+department+" "+course_nbr+")";	
}

/*Get the course description from the profurl and highlight the important elements, as well as set the eCIS, and rmp links.*/
function getDescription(){
	chrome.runtime.sendMessage({
		method: "GET",
		action: "xhttp",
		url: profurl,
		data: ""
	}, function(response) {
		if(response){
			var output="";
			var object = $('<div/>').html(response).contents();
			object.find('#details > p').each(function(){
				var sentence = $(this).text();
				if(sentence.indexOf("Prerequisite") == 0){
					sentence = "<li style='font-weight: bold; padding: 0px 5px 5px 5px;'>"+sentence+"</li>";
				}
				else if(sentence.indexOf("May be") >=0 ){
					sentence = "<li style='font-style: italic; padding: 0px 5px 5px 5px;'>"+sentence+"</li>";
				}
				else if(sentence.indexOf("Restricted to") == 0){
				sentence = "<li style='color:red; padding: 0px 5px 5px 5px;'>"+sentence+"</li>";
			}
			else{
				sentence= "<li  style='padding: 0px 5px 5px 5px;'>"+sentence+"</li>";
			}
			output+=sentence;
			
		});
			description = output;
			$("#description").animate({'opacity': 0}, 200, function(){
				$(this).html(description).animate({'opacity': 1}, 200);    
			});
			var first = object.find('td[data-th="Instructor"]').text();
			first = first.substring(first.indexOf(", "),first.indexOf(" ",first.indexOf(", ")+2));
			first = first.substring(2);
			rmpLink = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+texas+at+austin&queryoption=HEADER&query="+first+" "+profname+";&facetSearch=true";
			if(profname == ""){
				eCISLink = "http://utdirect.utexas.edu/ctl/ecis/results/index.WBX?s_in_action_sw=S&s_in_search_type_sw=C&s_in_max_nbr_return=10&s_in_search_course_dept="+department+"&s_in_search_course_num="+course_nbr;
			}
			else{
				eCISLink = "http://utdirect.utexas.edu/ctl/ecis/results/index.WBX?&s_in_action_sw=S&s_in_search_type_sw=N&s_in_search_name="+profname.substring(0,1)+profname.substring(1).toLowerCase()+"%2C%20"+first.substring(0,1)+first.substring(1).toLowerCase();
			}
		} else {
			description = "Please Refresh the Page"
		}
	});

}

/* Load the database*/
function loadDataBase(){
	sql = window.SQL;
	loadBinaryFile('grades.db', function(data){
		var sqldb = new SQL.Database(data);
		grades = sqldb;
	});
}
/* load the database from file */
function loadBinaryFile(path,success) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", chrome.extension.getURL(path), true); 
	xhr.responseType = "arraybuffer";
	xhr.onload = function() {
		var data = new Uint8Array(xhr.response);
		var arr = new Array();
		for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			success(arr.join(""));
	};
	xhr.send();
};