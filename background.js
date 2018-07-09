chrome.runtime.onMessage.addListener(function(request, sender, response) {
	if(request.greeting == "hello") {
		getSaved(request,sender,response);
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


function getSaved(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
      sendResponse({farewell: "goodbye"});
}