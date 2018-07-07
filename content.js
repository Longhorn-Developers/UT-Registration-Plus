var grades;

var coursename;
var profname;
var profurl;
var department;
var course_nbr;
var description;
$(document).ready( function() {
	loadDataBase();
	//make heading
	$("table thead th:nth-child(5)").after('<th scope=col>Rating</th>');
	$("table thead th:nth-child(10)").after('<th scope=col>Dist</th>');
	var modhtml = '<div class=modal id=myModal><div class=modal-content><span class=close>×</span><div class=card><div class=cardcontainer><h2 class=title>Computer Fluency (C S 302)</h2><h2 class=profname>with Bruce Porter</h2></div></div><div class=card><div class=cardcontainer><h2 class=description></h2></div></div><div class=card><div class=cardcontainer><div id=chart></div></div></div></div>'

	$("#container").prepend(modhtml);
	//console.log(grades);
	
	$('table').find('tr').each(function(){
		if($(this).find('td').hasClass("course_header")){

		} else if($(this).has('th').length == 0){
			var rating;
			var profname = $(this).find('td').eq(4).text() + "";
			if(profname == ""){
	    		//console.log("No Professor");
	    		rating = "No Prof :(";
	    	} else {
	    		let lastname = profname.split(',')[0];
	    		rating = "Hello";
	    	}
	    	$(this).find('td').eq(4).after('<td data-th="Rating"><a href="http://example.com">'+rating+'</a></td>');
	    	$(this).append('<td data-th="Dist"><input type="image" class="distButton" style="vertical-align: bottom;" width="30" height="30" src='+chrome.extension.getURL('disticon.png')+' /></td>');
	    }
	});	
	$(this).find(".distButton").click(function(){
		//var coursename = $(this).closest(':has(.course_header)').find('.course_header');
		//CLEAN UP, "gack"- Michael Scott 
		var row = $(this).closest('tr');
		getCourseInfo(row);
		//console.log(profname + " "+department+" "+course_nbr);
		//console.log(coursename);
		getDistribution();
	});

});

function getCourseInfo(row){
	$('table').find('tr').each(function(){
		if($(this).find('td').hasClass("course_header")){
			coursename = $(this).find('td').text() + "";
		}
		if($(this).is(row)){
			profurl = $(this).find('td a').prop('href');
			profname = $(this).find('td').eq(4).text().split(',')[0];
			return false;
		}
	});
	getDescription();
	department = coursename.substring(0,coursename.search(/\d/)-2);
	//console.log(department);
	course_nbr = coursename.substring(coursename.search(/\d/),coursename.indexOf(" ",coursename.search(/\d/)));
}

function getDistribution(){
	var query = "select * from agg";
	query += " where dept like '%"+department+"%'";
	query += " and prof like '%"+profname+"%'";
	query += " and course_nbr like '%"+course_nbr+"%'";
	var res = grades.exec(query)[0];
	console.log(res);
	var output = "";
	openDialog(department,coursename,"aggregate",profname,res);
}

function openDialog(dep,cls,sem,professor,data){
	data = data.values[0];
	var modal = document.getElementById('myModal');
	var span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";

	$(".title").text(prettifyTitle());
	var name;
	if(profname == ""){
		name = "Undecided Professor ";
	}
	else{
		name = profname.substring(0,1)+profname.substring(1).toLowerCase();
	}

	$(".profname").text("with "+ name);
	console.log(coursename);
	span.onclick = function() {
		modal.style.display = "none";
	}
	if(typeof data == 'undefined'){

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
			headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
			'<td style="padding:0"><b>{point.y:.1f} Students</b></td></tr>',
			footerFormat: '</table>',
			shared: true,
			useHTML: true
		},
		plotOptions: {
			bar: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
		series: [{
			name: 'Grades',
			data: [{y: data[6], color: '#4CAF50'}, {y: data[7], color: '#8BC34A'}, {y: data[8], color: '#CDDC39'}, {y: data[9], color: '#FFEB3B'}, {y: data[10], color: '#FFC107'}, {y: data[11], color: '#FFA000'}, {y: data[12], color: '#F57C00'}, {y: data[13], color: '#FF5722'}, {y: data[14], color: '#FF5252'}, {y: data[15], color: '#E64A19'}, {y: data[16], color: '#F44336'}, {y: data[17], color: '#D32F2F'}]

		}]
	});
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
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
				output+=$(this).text()+"<br></>";
			});
			description = output;
			$(".description").animate({'opacity': 0}, 400, function(){
        		$(this).html(description).animate({'opacity': 1}, 300);    
   			});
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

