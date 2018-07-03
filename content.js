$(document).ready( function() {
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
    		//getProfessorFullName(profurl);
    		console.log(profname);
    		rating = "Hello";
    	}
        $(this).find('td').eq(4).after('<td data-th="Rating"><a href="http://example.com">'+rating+'</a></td>');
    });
});



function getProfessorFullName(profurl){
}

//http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university of texas at austin&query="+url+"&facetSearch=true"
