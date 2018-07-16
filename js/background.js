chrome.runtime.onMessage.addListener(function(request, sender, response) {
	if(request.command == "courseStorage") {
		if(request.action == "add"){
			add(request,sender,response);
		}
		if(request.action == "remove"){
			remove(request,sender,response);
		}
	}
	else if(request.command == "isSingleConflict"){
		isSingleConflict(request.dtarr,request.unique,response);
	}
	else if(request.command == "checkConflicts"){
		checkConflicts(response);
	}
	else if(request.command == "alreadyContains"){
		alreadyContains(request.unique,response);
	}
	else{
		const xhr = new XMLHttpRequest();
		const method = request.method ? request.method.toUpperCase() : "GET";
		xhr.open(method, request.url, true);
		xhr.onload = () => response(xhr.responseText);
		xhr.onerror = () => response(xhr.statusText);
		if (method == "POST") {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		xhr.send(request.data);
	}
	return true;
});

 chrome.runtime.onInstalled.addListener(function() {
 	var arr = new Array();
    chrome.storage.sync.set({savedCourses: arr}, function() {
      console.log('initial course list');
    });
});

function checkConflicts(sendResponse) {
	chrome.storage.sync.get('savedCourses', function(data) {
		var conflicts = [];
		var courses = data.savedCourses;
		for(var i = 0; i<courses.length;i++){
			for(var j=i+1; j<courses.length; j++){
				if(isConflict(courses[i].datetimearr,courses[j].datetimearr)){
					console.log("conflict");
					conflicts.push([courses[i],courses[j]]);
				}
			}
		}
		if(conflicts.length == 0){
			sendResponse({isConflict:false});
		} else {
			console.log(conflicts);
			sendResponse({isConflict:true,between: conflicts});
		}
	});
}

function isSingleConflict(currdatearr, unique, sendResponse){
	chrome.storage.sync.get('savedCourses', function(data) {
		var courses = data.savedCourses;
		var conflict = false;
		for(var i = 0; i<courses.length;i++){
			if(isConflict(currdatearr,courses[i].datetimearr)){
				conflict = true;
				break;
			}
		}
		var contains = false;
		var i = 0;
		while(i < courses.length && !contains){
			if(courses[i].unique == unique){
				contains = true;
			}
			i++;
		}
		sendResponse({isConflict:conflict,alreadyContains:contains});
	});
}

function isConflict(adtarr, bdtarr){
	for(var i = 0; i<adtarr.length;i++){
		var currday = adtarr[i][0];
		var currtimes = adtarr[i][1];
		for(var j = 0; j<bdtarr.length;j++){
			var nextday = bdtarr[j][0];
			var nextimes = bdtarr[j][1];
			if(nextday == currday){
				if(currtimes[0] < nextimes[1] && currtimes[1] > nextimes[0]){
					return true;
				}
			}
		}
	}
	return false;
}

function add(request, sender, sendResponse) {
	chrome.storage.sync.get('savedCourses', function(data) {
		var courses = data.savedCourses;
		courses.push(request.course)
		console.log(courses);
		chrome.storage.sync.set({savedCourses: courses});
		sendResponse({done:"Added: ("+request.course.unique+") "+request.course.coursename,label:"Remove Course -"});
	});
}
function remove(request, sender, sendResponse) {
	chrome.storage.sync.get('savedCourses', function(data) {
		var courses = data.savedCourses;
		console.log(courses);
		var index = 0;
		console.log(courses.length);
		while(index<courses.length && courses[index].unique != request.course.unique){
			index++;
		}
		courses.splice(index,1);
		chrome.storage.sync.set({savedCourses: courses});
		sendResponse({done:"Removed: ("+request.course.unique+") "+request.course.coursename,label:"Add Course +"});
	});
}

function alreadyContains(unique,sendResponse){
	chrome.storage.sync.get('savedCourses', function(data) {
		var courses = data.savedCourses;
		var contains = false;
		var i = 0;
		while(i < courses.length && !contains){
			if(courses[i].unique == unique){
				contains = true;
			}
			i++;
		}
		sendResponse({alreadyContains: contains});
	});
}