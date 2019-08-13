if ($('html').hasClass('gr__utexas_collegescheduler_com')) {
    $.initialize("table.section-detail-grid", function () {
        $(this).find('thead>tr').append('<th> Plus</th')
        $(this).find('tbody>tr').each(function () {
            $(this).append(Template.Main.extension_button());
        })
    });
}
curr_course = {}
$("body").prepend(Template.Main.modal());

$("body").on('click', '#distButton', function () {
    var row = $(this).closest('tr');
    console.log(row.text())
    $('.modal-content').stop().animate({
        scrollTop: 0
    }, 500);
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
        "times": times,
    }
    curr_course = course_data;
    getDistribution(course_data);
    var modal = document.getElementById('myModal');
    window.onclick = function (event) {
        if (event.target == modal) {
            close();
        }
    }
}

function badData(course_data, res) {
    return typeof res == 'undefined' || course_data["prof_name"] == "Staff";
}

$("#semesters").on('change', function () {
    var sem = $(this).val();
    sem = sem == "Aggregate" ? undefined : sem;
    getDistribution(curr_course, sem);
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
    $("#title").text(buildTitle(course_data))
    $("#topbuttons").before(buildTimeTitle(course_data["times"]));
    $("#profname").text(buildProfTitle(course_data));
    $("#myModal").fadeIn(Timing.fade_time);
    buildSemestersDropdown(course_data, res)
    var data = []
    if (!badData(course_data, res))
        data = res.values[0];
    setChart(data);
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

function close() {
    $("#myModal").fadeOut(Timing.fade_time);
}