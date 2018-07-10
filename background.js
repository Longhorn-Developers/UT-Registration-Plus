chrome.runtime.onMessage.addListener(function(request, sender, response) {
	if(request.command == "courseStorage") {
		if(request.action == "add"){
			add(request,sender,response);
		}
		if(request.action == "remove"){
			remove(request,sender,response);
		}
	}
	else if(request.command == "alreadyContains"){
		alreadyContains(request.course,response);
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

function add(request, sender, sendResponse) {
	var courses;
	var response;
	chrome.storage.sync.get('savedCourses', function(data) {
		courses = data.savedCourses;
		courses.push(request.course)
		console.log(courses);
		chrome.storage.sync.set({savedCourses: courses});
		sendResponse({done:"Added: "+request.course.unique+request.course.coursename,label:"Remove Course -"});
	});
}
function remove(request, sender, sendResponse) {
	var courses;
	var response;
	chrome.storage.sync.get('savedCourses', function(data) {
		courses = data.savedCourses;
		var index = 0;
		while(index<courses.length && courses[index].unique != request.course.unique){
			index++;
		}
		courses.splice(index,1);
		console.log(courses);
		chrome.storage.sync.set({savedCourses: courses});
		sendResponse({done:"removed: "+request.course.unique+request.course.coursename,label:"Add Course +"});
	});
}

function alreadyContains(course,sendResponse){
	chrome.storage.sync.get('savedCourses', function(data) {
		courses = data.savedCourses;
		var contains = false;
		var i = 0;
		while(i < courses.length && !contains){
			if(courses[i].unique == course.unique){
				contains = true;
			}
			i++;
		}
		sendResponse({alreadyContains: contains});
	});
}