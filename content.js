var grades;

var coursename;
var profname;
var department;
var course_nbr;
$(document).ready( function() {
	loadDataBase();

	//make heading
	$("table thead th:nth-child(5)").after('<th scope=col>Rating</th>');
	$("table thead th:nth-child(9)").after('<th scope=col>Dist</th>');
	var modhtml = '<div id="myModal" class="modal"><div class="modal-content"><span class="close">&times;</span><h2 class="title">Computer Fluency (C S 302)</h2><h2 class="subtitle">with B. Porter</h2><div id="chart"></div></div></div>'
	$("#container").prepend(modhtml);
	//console.log(grades);
	
	$('table').find('tr').each(function(){
		if($(this).find('td').hasClass("course_header")){

		} else if($(this).has('th').length == 0){
			var rating;
			var profname = $(this).find('td').eq(4).text() + "";
			// var profurl = $(this).find('td a').prop('href');
			if(profname == ""){
	    		//console.log("No Professor");
	    		rating = "No Prof :(";
	    	} else {
	    		let lastname = profname.split(',')[0];
	    		rating = "Hello";
	    	}
	    	$(this).find('td').eq(4).after('<td data-th="Rating"><a href="http://example.com">'+rating+'</a></td>');
	    	$(this).append('<td data-th="Dist"><input type="image" class="distButton" style="vertical-align: bottom;" width="30" height="30" src='+chrome.extension.getURL('disticon.png')+' /></td>');
	    }
	});	
	$(this).find(".distButton").click(function(){
		//var coursename = $(this).closest(':has(.course_header)').find('.course_header');
		//CLEAN UP, "gack"- Michael Scott 
		var row = $(this).closest('tr');
		getCourseInfo(row);
		//console.log(profname + " "+department+" "+course_nbr);
		//console.log(coursename);
		getDistribution();
	});

});

function getCourseInfo(row){
	$('table').find('tr').each(function(){
		if($(this).find('td').hasClass("course_header")){
			coursename = $(this).find('td').text() + "";
		}
		if($(this).is(row)){
		    profname = $(this).find('td').eq(4).text().split(',')[0];
			return false;
		}
	});
	department = coursename.substring(0,coursename.search(/\d/)-2);
//	console.log(department);
	course_nbr = coursename.substring(coursename.search(/\d/),coursename.indexOf(" ",coursename.search(/\d/)));
}

function getDistribution(){
	var query = "select * from agg";
    	query += " where dept like '%"+department+"%'";
    	query += " and prof like '%"+profname+"%'";
    	query += " and course_nbr like '%"+course_nbr+"%'";
	var res = grades.exec(query)[0];
	console.log(res);
	var output = "";
	if(typeof res == 'undefined'){
		output="No Data on that Professor teaching that course :(";
	} else {
		// output += "A: "+ res.values[0][6] + " ";
		// output += "A-: " + res.values[0][7] + "\n";
		// output += "B+: " + res.values[0][8] + " ";
		// output += "B: " + res.values[0][9] + " ";
		// output += "B-: " + res.values[0][10] + "\n";
		// output += "C+: " + res.values[0][11] + " ";
		// output+="C+: " + res.values[0][12] + " ";
		// output+="C-: " + res.values[0][13] + "\n";
		// output+="D+: " + res.values[0][14] + "\n";
		// output+="D: " + res.values[0][15] + " ";
		// output+="D-: " + res.values[0][16] + "\n";
		// output+="F: " + res.values[0][17] + "\n";
		openDialog();
	}
	//alert(output);
}

function openDialog(){
	var modal = document.getElementById('myModal');
	var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    $(".title").text(coursename);
    console.log(coursename);
	span.onclick = function() {
    	modal.style.display = "none";
	}

	Highcharts.chart('chart', {

    title: {
        text: 'Solar Employment Growth by Sector, 2010-2016'
    },

    subtitle: {
        text: 'Source: thesolarfoundation.com'
    },

    yAxis: {
        title: {
            text: 'Number of Employees'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010
        }
    },

    series: [{
        name: 'Installation',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    }, {
        name: 'Manufacturing',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
    }, {
        name: 'Sales & Distribution',
        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
    }, {
        name: 'Project Development',
        data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
    }, {
        name: 'Other',
        data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

}

function loadDataBase(){
	sql = window.SQL;
	loadBinaryFile('grades.db', function(data){
		var sqldb = new SQL.Database(data);
    	// Database is ready
    	grades = sqldb;
    	//console.log(grades.exec(query)[0]);
    });
}
function loadBinaryFile(path,success) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", chrome.extension.getURL(path), true); 
	xhr.responseType = "arraybuffer";
	xhr.onload = function() {
		var data = new Uint8Array(xhr.response);
		var arr = new Array();
		for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			success(arr.join(""));
	};
	xhr.send();
};

// function getProfessorLink(profname) {
// 	var name = profname.split(',');
// 	var lastname = profname[0];
// 	var firstinit = profname[1].substring(1);
// 	console.log(lastname + " "+firstinit);

// 	return new Promise((resolve, reject) => {
// 		chrome.runtime.sendMessage({
// 			method: "POST",
// 			url: "http://www.ratemyprofessors.com/search.jsp",
// 			data: "queryBy=teacherName&schoolName=university+of+texas+at+austin&query="+profname+"&facetSearch=true"
// 		}, function(response) {
// 			if (response) {
// 				console.log(response);
// 			}
// 		});
// 	});
// }

