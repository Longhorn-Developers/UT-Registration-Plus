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
var times = [];
var dates = [];
var locations = [];
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
	var modhtml = '<div class=modal id=myModal><div class=modal-content><span class=close>×</span><div class=card><div class=cardcontainer><h2 class=title>Computer Fluency (C S 302)</h2><h2 class=profname>with Bruce Porter</h2><div class=topbuttons><button class=matbut id="rateMyProf" style="background: #4CAF50;"> RMP </button><button class=matbut id="eCIS" style="background: #CDDC39;"> eCIS </button><button class=matbut id="Syllabi"> Past Syllabi </button><button class=matbut id="saveCourse" style="background: #F44336;"> Save Course +</button></div></div></div><div class=card><div class=cardcontainer style=""><ul class=description style="list-style-type:disc"></ul></div></div><div class=card><div class=cardcontainer><div id=chart></div></div></div></div>'
	$("#container").prepend(modhtml);
	$('table').find('tr').each(function(){
	    if(!($(this).find('td').hasClass("course_header")) && $(this).has('th').length == 0){
	    	//if a course row, then add the extension button and do something if that course has been "saved"
	    	$(this).append('<td data-th="Plus"><input type="image" class="distButton" style="vertical-align: bottom; display:block;" width="25" height="25" src='+chrome.extension.getURL('disticon.png')+' /></td>');
	    	chrome.runtime.sendMessage({command: "alreadyContains",unique: $(this).find('td[data-th="Unique"]').text()}, function(response) {
				if(response.alreadyContains){
					//DO SOMETHING IF ALREADY CONTAINS
				} 
			});
	    }
	});

	$(".distButton").click(function(){
		var row = $(this).closest('tr');
		getCourseInfo(row);
		getDistribution();
	});

	$("#saveCourse").click(function(){
		var c = new Course(coursename,uniquenum, profname, times, dates, locations, status, profurl);
		chrome.runtime.sendMessage({command: "courseStorage",course: c, action:$("#saveCourse").text().substring(0,$("#saveCourse").text().indexOf(" ")).toLowerCase()}, function(response) {
			$("#saveCourse").text(response.label);
			alert(response.done);
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
	$(document).keydown(function(e) { 
    	if (e.keyCode == 27) { 
        	$(".modal").fadeOut(fadetime);
    	} 
	});
});

function Course(coursename, unique, profname, times, dates, locations, status, link){
	this.coursename = coursename;
	this.unique = unique;
	this.profname = profname;
	this.times = times;
	this.dates = dates;
	this.locations = locations;
	this.status = status;
	this.link = link;
}

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
		    console.log(status);
			profname = $(this).find('td[data-th="Instructor"]').text().split(', ')[0];
			profinit = $(this).find('td[data-th="Instructor"]').text().split(', ')[1];
			if(profname.indexOf(" ") == 0){
				profname = profname.substring(1);
			}
			var numlines = $(this).find('td[data-th="Days"]>span').length;
			for(var i=0; i<numlines;i++){
				var date = $(this).find('td[data-th="Days"]>span:eq('+i+')').text();
				var time = $(this).find('td[data-th="Hour"]>span:eq('+i+')').text();
				var place = $(this).find('td[data-th="Room"]>span:eq('+i+')').text();
				dates.push(date);
				times.push(time);
				locations.push(place);
				$(".topbuttons").before('<h2 class="dateTimePlace">'+makeLine(date,time,place)+'</th>');
			//	makeLine(date,time,place);
			}
			return false;
		}
	});
	if(typeof coursename == 'undefined'){
		coursename = $("#details h2").text();
		console.log(profname+" "+profinit);
		profinit = profinit.substring(0,1);
		profurl = document.URL;
	}
	//console.log(coursename);
	getDescription();
	department = coursename.substring(0,coursename.search(/\d/)-2);
	//console.log(department);
	course_nbr = coursename.substring(coursename.search(/\d/),coursename.indexOf(" ",coursename.search(/\d/)));
}

//MWF
//TTH
//MTHF
function makeLine(date, time, place){
	var arr = new Array();
	var output = "";
	for(var i = 0; i<date.length;i++){
		var letter = date.charAt(i);
		var day = "";
		if(letter == "T" && i <date.length-1 && date.charAt(i+1) == "H"){
			arr.push(days.get("TH"));
		}
		else {
			if(letter != "H"){
				arr.push(days.get(letter));
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
	return output + " at "+time.replace(/\./g,'').replace(/\-/g,' to ')+" in "+"<a style='font-size:medium' target='_blank' href='"+"https://maps.utexas.edu/buildings/UTM/"+building+"''>"+place.substring(0,place.search(/\d/)-1)+"</>";
}
function getDistribution(){
	var query = "select * from agg";
	query += " where dept like '%"+department+"%'";
	query += " and prof like '%"+profname+"%'";
	query += " and course_nbr like '%"+course_nbr+"%'";
//	console.log(query);
	var res = grades.exec(query)[0];
//	console.log(res);
	var output = "";
	openDialog(department,coursename,"aggregate",profname,res);
}

function openDialog(dep,cls,sem,professor,res){
	$(".modal").fadeIn(fadetime);
	chrome.runtime.sendMessage({command: "alreadyContains",unique: uniquenum}, function(response) {
		console.log("Already Contains: "+response.alreadyContains);
		if(response.alreadyContains){
			$("#saveCourse").text("Remove Course -");
		} 
		else{
			$("#saveCourse").text("Add Course +");
		}
	});
	var data;
	if(typeof res == 'undefined'){
		data = [];
	}
	else{
		data = res.values[0];
	}
	var modal = document.getElementById('myModal');
	var span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";

	$(".title").text(prettifyTitle());
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
	$(".title").append("<span style='color:"+color+";font-size:medium;'>"+" #"+uniquenum+"</>");
	var name;
	if(profname == ""){
		name = "Undecided Professor ";
		if(typeof res == 'undefined'){

		}
	}
	else{
		name = profinit+". "+profname.substring(0,1)+profname.substring(1).toLowerCase();
	}

	$(".profname").text("with "+ name);
//console.log(coursename);
span.onclick = function() {
	$(".modal").fadeOut(200);
}
chart = Highcharts.chart('chart', {
	chart: {
		type: 'column',
		spacingLeft: 10
	},
	title: {
		text: null
	},
	subtitle: {
		text: null
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

});	// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		$(".modal").fadeOut(fadetime);
	}
}	
}

function prettifyTitle(){
	val = department.length+course_nbr.length+3;
	output = coursename.substring(val).replace(/\b\w*/g, function(txt){
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
	
	return output + " ("+department+" "+course_nbr+")";	
}

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
				console.log(sentence.indexOf("May be"));
				sentence = "<li style='font-style: italic; padding: 0px 5px 5px 5px;'>"+sentence+"</li>";
			}
			else if(sentence.indexOf("Restricted to") == 0){
				//console.log(sentence);
				sentence = "<li style='color:red; padding: 0px 5px 5px 5px;'>"+sentence+"</li>";
			}
			else{
				sentence= "<li  style='padding: 0px 5px 5px 5px;'>"+sentence+"</li>";
			}
			output+=sentence;
			
		});
		description = output;
		$(".description").animate({'opacity': 0}, 200, function(){
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
	}
});

}

function loadDataBase(){
sql = window.SQL;
loadBinaryFile('grades.db', function(data){
	var sqldb = new SQL.Database(data);
	// Database is ready
	grades = sqldb;
	//console.log(grades.exec(query)[0]);
});
}
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

// function getProfessorLink(profname) {
// 	var name = profname.split(',');
// 	var lastname = profname[0];
// 	var firstinit = profname[1].substring(1);
// 	console.log(lastname + " "+firstinit);

// 	return new Promise((resolve, reject) => {
// 		chrome.runtime.sendMessage({
// 			method: "POST",
// 			url: "http://www.ratemyprofessors.com/search.jsp",
// 			data: "queryBy=teacherName&schoolName=university+of+texas+at+austin&query="+profname+"&facetSearch=true"
// 		}, function(response) {
// 			if (response) {
// 				console.log(response);
// 			}
// 		});
// 	});
// }

