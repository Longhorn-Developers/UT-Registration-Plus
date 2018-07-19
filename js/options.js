chrome.storage.sync.get('courseConflictHighlight', function(data) {
	if(data.courseConflictHighlight){
		$("#toggleConflictHighlighting").text("Turn Off");
		$("#toggleConflictHighlighting").css("background","#F44336");
	}
	else {
		$("#toggleConflictHighlighting").text("Turn On");
		$("#toggleConflictHighlighting").css("background","#4CAF50");
	}
});

$("#toggleConflictHighlighting").click(function(){
	var action = $("#toggleConflictHighlighting").text();
	if(action == "Turn Off"){
		chrome.storage.sync.set({courseConflictHighlight: false}, function() {
			$("#toggleConflictHighlighting").text("Turn On");
			$("#toggleConflictHighlighting").css("background","#4CAF50");
		});		
	} else{
		chrome.storage.sync.set({courseConflictHighlight: true}, function() {
			$("#toggleConflictHighlighting").text("Turn Off");
			$("#toggleConflictHighlighting").css("background","#F44336");
		});	
	}
	chrome.tabs.query({}, function(tabs) {
		for(var i = 0; i<tabs.length; i++){
			chrome.tabs.sendMessage(tabs[i].id, {command: "updateCourseList"});
		}
	});
});