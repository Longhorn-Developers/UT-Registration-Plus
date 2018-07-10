chrome.storage.sync.get('savedCourses', function(data) {
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
			var listhtml = "<li style='padding: 0px 5px 5px 5px; overflow-y: auto;max-height:400px;'> <div style='display:-webkit-inline-box;'><h2 style='padding:5px; font-size:medium;'>"+courses[i].unique+"</h2><div class='card'><div class='container' style='background:"+color+"''><h4 style='color:white'><b>"+courses[i].coursename+"</b></h4> </div></div><div> </li>";
			$("#courseList").append(listhtml);

		}
});

$(document).keydown(function(e) { 
    	if (e.keyCode == 67) { 
        	clear();
    	} 
	});
function clear(){
	chrome.storage.sync.set({savedCourses: []});
	console.log("cleared");
	$("#courseList").fadeOut(300);	
}
function update(){

}