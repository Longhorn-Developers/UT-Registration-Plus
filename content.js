$(document).ready( function() {
	sql = window.SQL;
	loadBinaryFile('grades.db', function(data){
        var sqldb = new SQL.Database(data);
        // Database is ready
        var res = sqldb.exec("SELECT * from agg where dept like '%C S%' and course_nbr like '%314%'");
        console.log(res[0].values);
    });
    $("table thead th:nth-child(5)").after('<th scope=col>Rating</th>');
    $('table').find('tr').each(function(){
    	var rating;
    	var profname = $(this).find('td').eq(4).text();
    	var profurl = $(this).find('td a').prop('href');
    	if(profname == ""){
    		//console.log("No Professor");
    		rating = "No Prof :(";
    	} else {
    		console.log(profurl);
    		//getProfessorTID();
    		//getProfessorFullName(profurl);
    	//	console.log(lastname[0]);
    		rating = "Hello";
    	}
        $(this).find('td').eq(4).after('<td data-th="Rating"><a href="http://example.com">'+rating+'</a></td>');
    });
});

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

// function getProfessorTID(profname) {
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

