var grades;
var profname;
var department;
var course_nbr;
$(document).ready( function() {
	loaddataBase();	
	//make heading
	$("table thead th:nth-child(5)").after('<th scope=col>Rating</th>');
	$("table thead th:nth-child(10)").after('<th scope=col>Dist</th>');
	//console.log(grades);
	
	$('table').find('tr').each(function(){
		if($(this).find('td').hasClass("course_header")){

		} else if($(this).has('th').length == 0){
			var rating;
			var profname = $(this).find('td').eq(4).text() + "";
			// var profurl = $(this).find('td a').prop('href');
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
	var coursename;
	$('table').find('tr').each(function(){
		if($(this).find('td').hasClass("course_header")){
			coursename = $(this).find('td').text() + "";
		}
		if($(this).is(row)){
		    profname = $(this).find('td').eq(4).text().split(',')[0];
			return false;
		}
	});
	department = coursename.substring(0,coursename.search(/\d/)-2);
//	console.log(department);
	course_nbr = coursename.substring(coursename.search(/\d/),coursename.indexOf(" ",coursename.search(/\d/)));
}

function getDistribution(){
	var query = "select * from agg";
    	query += " where dept like '%"+department+"%'";
    	query += " and prof like '%"+profname+"%'";
    	query += " and course_nbr like '%"+course_nbr+"%'";
	alert(grades.exec(query)[0].values);
}

function loaddataBase(){
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

