chrome.storage.sync.get('savedCourses', function(data) {
	chrome.runtime.sendMessage({command: "checkConflicts"}, function(response) {
			if(response.isConflict){
					var between = response.between;
					var text = "";
					for(var i = 0; i<between.length;i++){
						text+="Conflict between: "+between[i][0].coursename + " and "+between[i][1].coursename+"\n";
						if(i != between.length-1){
							text+= "<br>";
						}
					}
					$("#courseList").prepend("<p style='font-size:small; font-weight:bold; color:red; margin:5px;'>"+text+"</>");
				} 
			});
		var courses = data.savedCourses;
		console.log(courses);
		for(var i = 0; i<courses.length;i++){
			var color;
			status = courses[i].status;
			if(status.includes("open")){
				color = "#4CAF50";
			}
			else if(status.includes("waitlisted")){
				color = "#FF9800"
			}
			else if(status.includes("closed") || status.includes("cancelled")){
				color = "#F44336";
			}
			var department = courses[i].coursename.substring(0,courses[i].coursename.search(/\d/)-2);
			var course_nbr = courses[i].coursename.substring(courses[i].coursename.search(/\d/),courses[i].coursename.indexOf(" ",courses[i].coursename.search(/\d/)));
			var profname = courses[i].profname.substring(0,1)+courses[i].profname.substring(1).toLowerCase();
			var listhtml = "<li style='padding: 0px 5px 5px 5px; overflow-y: auto;max-height:400px;'><div class='card'><div class='container' style='background:"+color+"''><h4 style='color:white; margin:5px; font-size:large;'><b>"+department + " "+course_nbr+"<span style='font-size:medium'>"+" with </span><span style='font-size:medium'>"+profname+"</span></b></h4></div></div></li>";
			$("#courseList").append(listhtml);
		}
});

$(document).ready(function() {
    $("#clear").click(function(){
    	clear();
	});
});

function clear(){
	chrome.storage.sync.set({savedCourses: []});
	console.log("cleared");
	$("#courseList").fadeOut(300);	
}
function update(){

}