$(document).ready( function() {
	//dataBase("C S","Scott","314");
	//make heading
	$("table thead th:nth-child(5)").after('<th scope=col>Rating</th>');
	var coursename;
	$('table').find('tr').each(function(){
		if($(this).find('td').hasClass("course_header")){
			coursename = $(this).find('td').text() + "";
		} else if($(this).has('th').length == 0){
			let department = coursename.substring(0,coursename.search(/\d/)-1);
			console.log(department);
			let course_nbr = coursename.substring(coursename.search(/\d/),coursename.indexOf(" ",coursename.search(/\d/)));
			//console.log(course_nbr);
			var rating;
			var profname = $(this).find('td').eq(4).text() + "";
			var profurl = $(this).find('td a').prop('href');
			if(profname == ""){
	    		//console.log("No Professor");
	    		rating = "No Prof :(";
	    	} else {
	    		let lastname = profname.split(',')[0];
	    		//console.log(profurl);
	    		//dataBase(department,lastname,course_nbr);
	    		//getProfessorFullName(profurl);
	    		rating = "Hello";
	    	}
	    	$(this).find('td').eq(4).after('<td data-th="Rating"><a href="http://example.com">'+rating+'</a></td>');
    	}
	});
});

function dataBase(department, profname, course_nbr){
	sql = window.SQL;
	loadBinaryFile('grades.db', function(data){
		var sqldb = new SQL.Database(data);
    	// Database is ready
    	var query = "select * from agg";
    	query += " where dept like '%"+department+"%'";
    	query += " and prof like '%"+profname+"%'";
    	query += " and course_nbr like '%"+course_nbr+"%'";
    	console.log(query);
    	var res = sqldb.exec(query);
    	console.log(res[0]);
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

