$(function () {
	//template https://utdirect.utexas.edu/apps/registrar/course_schedule/20189/51475/
	var sem = $('[name="s_ccyys"]').val();
	$(".tbg").after("<button class='matbut' id='import' style='margin:10px 0px 20px 0px;'><span style='font-size:small'>Import into </span><b>UT Reg Plus<b></h2>");
	$("#import").click(function(){
		$(".tbg").find(".tbon>td:first-child").each(function(){
			console.log($(this).text().replace(/\s/g, ''));
		});
			alert(sem);	

	});

});