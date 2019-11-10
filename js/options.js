var manifestData = chrome.runtime.getManifest();
$("#version").text(manifestData.version);

chrome.storage.sync.get('options', function(data){
	if(data.options){
		console.log(data.options);
		Object.keys(data.options).forEach(key => {
			let enabled = data.options[key];
			$('#options_container').append(Template.Options.options_row(key, enabled));
		});
	}
});

$("body").on("click","button",function(){
	let key = $(this).attr('id');
	let old_status = $(this).val() === 'true';
	let new_status = !old_status;
	chrome.runtime.sendMessage({
		command: "setOptionsValue",
		key: key,
		value: new_status
	}, function (response) {
		console.log(response.value);
		toggle(key, response.value)
		updateAllTabsCourseList();
	});
});



function toggle(key, value) {
	let button_text = value ? "Turn Off": "Turn On";
	let button_color = value ? Colors.closed : Colors.open ;
	$(`#${key}`).text(button_text);
	$(`#${key}`).css("background", button_color);
	$(`#${key}`).val(value);
}
