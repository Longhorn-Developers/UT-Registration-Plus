var manifestData = chrome.runtime.getManifest();
$("#version").text(manifestData.version);
chrome.storage.sync.get('courseConflictHighlight', function (data) {
	if (data.courseConflictHighlight) {
		off('courseConflictHighlight');
	} else {
		on('courseConflictHighlight');
	}
});
chrome.storage.sync.get('loadAll', function (data) {
	if (data.loadAll) {
		off('loadAll');
	} else {
		on('loadAll');
	}
});

$("#togglecourseConflictHighlight").click(function () {
	var action = $("#togglecourseConflictHighlight").text();
	if (action == "Turn Off") {
		chrome.storage.sync.set({
			courseConflictHighlight: false
		}, function () {
			on('courseConflictHighlight');
		});
	} else {
		chrome.storage.sync.set({
			courseConflictHighlight: true
		}, function () {
			off('courseConflictHighlight');
		});
	}
	updateAllTabsCourseList();
});


$("#toggleloadAll").click(function () {
	var action = $("#toggleloadAll").text();
	if (action == "Turn Off") {
		chrome.storage.sync.set({
			loadAll: false
		}, function () {
			on('loadAll');
		});
	} else {
		chrome.storage.sync.set({
			loadAll: true
		}, function () {
			off('loadAll');
		});
	}
});



function on(setting) {
	$("#toggle" + setting).text("Turn On");
	$("#toggle" + setting).css("background", "#4CAF50");
}

function off(setting) {
	$("#toggle" + setting).text("Turn Off");
	$("#toggle" + setting).css("background", "#F44336");
}