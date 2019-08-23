let semester_code = "";
curr_course = {}

chrome.runtime.sendMessage({
    command: "currentSemesters"
}, function(response){
    let semester_text = $('.row:contains(Semester)').find('span').text();
    let key = semester_text.split(' ').reverse().join(' ');
    semester_code = response.semesters[key];
});

$.initialize("table.section-detail-grid", function () {
    $(this).find('thead>tr').append('<th> Plus</th')
    $(this).find('tbody>tr').each(function () {
        $(this).append(Template.Main.extension_button());
    })
});

$("body").prepend(Template.UTPlanner.modal());
$("body").on('click', '#distButton', function () {
    var row = $(this).closest('tr');
    $('.modal-content').stop().animate({ scrollTop: 0 }, 500);
    $(this).blur();
    getCourseInfo(row)
});


function getCourseInfo(row) {
    let rowdata = $(row).find('td').slice(3).toArray().map(x => $(x).text().trim());
    let [uniquenum, department, coursenum, coursename, profname, notes, rawtime] = rowdata
    let profinit = ""
    if (profname !== undefined && profname != "Staff") {
        profinit = profname.split(',')[1].trim();
        profname = profname.split(',')[0].trim();
    }
    let times = rawtime.split('\n').map(x => x.trim());
    var course_data = {
        "unique": uniquenum,
        "department": department,
        "number": coursenum,
        "name": coursename,
        "prof_name": profname,
        "initial": profinit,
        "notes": notes,
        "individual": `https://utdirect.utexas.edu/apps/registrar/course_schedule/${semester_code}/${uniquenum}/`,
        "times": times,
    }
    curr_course = buildCourseLinks(course_data);
    getDistribution(course_data);
    var modal = document.getElementById('myModal');
    window.onclick = function (event) {
        if (event.target == modal) {
            close();
        }
    }
}

function buildCourseLinks(course_info) {
    console.log(semester_code);
    let {
        department,
        number,
        unique,
        prof_name
    } = course_info
    links = {
        "textbook": `https://www.universitycoop.com/adoption-search-results?sn=${semester_code}__${department}__${number}__${unique}`,
        "syllabi": `https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?semester=&department=${department}&course_number=${number}&course_title=&unique=&instructor_first=&instructor_last=${prof_name}&course_type=In+Residence&search=Search`,
    }
    course_info["links"] = links;
    return course_info;
}

function badData(course_data, res) {
    return typeof res == 'undefined' || course_data["prof_name"] == "Staff";
}

$("#semesters").on('change', function () {
    var sem = $(this).val();
    sem = sem == "Aggregate" ? undefined : sem;
    getDistribution(curr_course, sem);
});

$("#Syllabi").click(function () {
    setTimeout(function () {
        window.open(curr_course["links"]["syllabi"]);
    }, Timing.button_delay);
});
$("#textbook").click(function () {
    setTimeout(function () {
        window.open(curr_course["links"]["textbook"]);
    }, Timing.button_delay);
});

$("#moreInfo").click(function () {
    setTimeout(function () {
        window.open(curr_course["individual"]);
    }, Timing.button_delay);
});


function toggleChartLoading(loading) {
    if (loading) {
        $('#chartload').css('display', 'inline-block');
        $("#chart").hide();
    } else {
        $('#chartload').hide();
        $("#chart").show();
    }
}


function openDialog(course_data, res) {
    console.log(course_data);
    $("#title").text(buildTitle(course_data))
    $("#topbuttons").before(buildTimeTitle(course_data["times"]));
    $("#profname").text(buildProfTitle(course_data));
    $("#myModal").fadeIn(Timing.fade_time);
    buildSemestersDropdown(course_data, res)
    var data = []
    if (!badData(course_data, res))
        data = res.values[0];
    setChart(data);
    allowClosing();
}

function buildProfTitle(course_data) {
    const {
        initial,
        prof_name
    } = course_data;
    return `with ${initial?initial+". ":""}${prof_name}`;
}

function buildSemestersDropdown(course_data, res) {
    $("#semesters").empty();
    if (badData(course_data, res)) {
        $("#semesters").append("<option>No Data</option>")
    } else {
        var semesters = res.values[0][18].split(",");
        semesters.sort(semesterSort);
        semesters.reverse().unshift('Aggregate');
        var sems = [];
        for (var i = 0; i < semesters.length; i++) {
            sems.push($(`<option value="${semesters[i]}">${semesters[i]}</option>`));
        }
        $("#semesters").append(sems);
    }
}


/*Query the grades database*/
function getDistribution(course_data, sem) {
    toggleChartLoading(true);
    let query = buildQuery(course_data, sem);
    chrome.runtime.sendMessage({
        command: "gradesQuery",
        query: query
    }, function (response) {
        var res = response.data;
        if (!sem) {
            openDialog(course_data, res);
        } else {
            var data = badData(course_data, res) ? [] : res.values[0];
            setChart(data);
        }
    });
}


function buildTitle(course_data) {
    return `${course_data["name"]} (${course_data["department"]} ${course_data["number"]})`
}


function buildTimeTitle(times) {
    $("h2.dateTimePlace").remove();
    var lines = []
    for (var i = 0; i < times.length; i++) {
        date = times[i].substring(0, times[i].indexOf(' ')).toUpperCase();
        time = times[i].substring(times[i].indexOf(' ') + 1, times[i].lastIndexOf('-')).trim();
        place = times[i].substring(times[i].lastIndexOf('-') + 1).trim();
        lines.push($(`<h2 class="dateTimePlace">${makeLine(date, time, place)}</th>`));
    }
    return lines
}

function makeLine(date, time, place) {
    var arr = seperateDays(date)
    var output = prettifyDaysText(arr)
    var building = place.substring(0, place.search(/\d/) - 1);
    building = building == "" ? "Undecided Location" : building;
    return `${output} at ${time.replace(/\./g, '').replace(/\-/g, ' to ')} in <a style='font-size:medium' target='_blank' href='https://maps.utexas.edu/buildings/UTM/${building}'>${building}</>`;
}

function setChart(data) {
    //set up the chart
    toggleChartLoading(false);
    chart = Highcharts.chart('chart', buildChartConfig(data), function (chart) { // on complete
        if (data.length == 0) {
            //if no data, then show the message and hide the series
            chart.renderer.text('Could not find data for this Instructor teaching this Course.', 100, 120)
                .css({
                    fontSize: '20px',
                    width: '300px',
                    align: 'center',
                    left: '160px'
                })
                .add();
            $.each(chart.series, function (i, ser) {
                ser.hide();
            });
        }
    });
}

function standardizeName(department, number, name){
    return `${department} ${number} ${name}`

}

function allowClosing() {
    $('.close').click(function () {
        close();
    });
    $('#myModal').click(function (event) {
        if (event.target.id == 'myModal') {
            close();
        }
    });
}

function close() {
    $("#myModal").fadeOut(Timing.fade_time);
    $("#snackbar").attr("class", "");
}