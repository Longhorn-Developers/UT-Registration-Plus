chrome.runtime.onMessage.addListener(function(request, sender, response) {
		const xhr = new XMLHttpRequest();
		const method = request.method ? request.method.toUpperCase() : "GET";
		xhr.open(method, request.url, true);
		xhr.onload = () => response(xhr.responseText);
		xhr.onerror = () => response(xhr.statusText);
		if (method == "POST") {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		xhr.send(request.data);
		return true;
});
