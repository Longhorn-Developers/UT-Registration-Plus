var manifestData = chrome.runtime.getManifest();
$("#version").text(manifestData.version);
chrome.storage.sync.get('courseConflictHighlight', function(data) {
	if(data.courseConflictHighlight){
		off();
	}
	else {
		on();
	}
});

$("#toggleConflictHighlighting").click(function(){
	var action = $("#toggleConflictHighlighting").text();
	if(action == "Turn Off"){
		chrome.storage.sync.set({courseConflictHighlight: false}, function() {
			on();
		});
	} else{
		chrome.storage.sync.set({courseConflictHighlight: true}, function() {
			off();
		});	
	}
	chrome.tabs.query({}, function(tabs) {
		for(var i = 0; i<tabs.length; i++){
			chrome.tabs.sendMessage(tabs[i].id, {command: "updateCourseList"});
		}
	});
});


function on(){
	$("#toggleConflictHighlighting").text("Turn On");
	$("#toggleConflictHighlighting").css("background","#4CAF50");
}
function off(){
	$("#toggleConflictHighlighting").text("Turn Off");
	$("#toggleConflictHighlighting").css("background","#F44336");
}
