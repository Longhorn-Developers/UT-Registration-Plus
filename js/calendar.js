$(function () {
    const materialColors = ['#4CAF50', '#CDDC39',
        '#FFC107', '#2196F3', '#F57C00', '#9C27B0', '#FF5722', '#673AB7',
        '#FF5252', '#E91E63', '#009688', '#00BCD4',
        '#4E342E', '#424242', '#9E9E9E'
    ];
    const days = new Map([
        ["M", "Monday"],
        ["T", "Tuesday"],
        ["W", "Wednesday"],
        ["TH", "Thursday"],
        ["F", "Friday"]
    ]);
    const fadetime = 150;
    const butdelay = 75;
    $("#calendar").prepend('<div id="myModal" class="modal"><div class="modal-content"><span class="close">&times;</span><div class="card"><div id="colorStrip" style="height:10px;"></div><div class="cardcontainer"><div><div style="display:flex;"><h2 id="classname">Classname</h2></div><p id="prof">Prof</p></div><div id="timelines"></div><button id="info" class="matbut" style="font-size:medium; margin-right: auto; margin-left:auto; background: #2196F3;">More Info</button><button id="register" class="matbut" style="font-size:medium; margin-right: auto; margin-left:10px; background: #4CAF50;">Register</button><button id="remove" class="matbut" style="font-size:medium;margin:10px;background: #FF0000;">Remove</button></div></div></div></div>');
    // Counter to iterate through material colors to avoid duplicates
    var colorCounter = 0;
    // Each schedule needs to store 'TITLE - START TIME - END TIME - COLOR'
    var classSchedules = [];
    var savedCourses = [];
    var currindex = 0;
    chrome.storage.sync.get("savedCourses", function (data) {
        // Iterate through each saved course and add to 'event'
        savedCourses = data.savedCourses;
        setAllEvents(savedCourses);

        $("#calendar").fullCalendar({
            editable: false, // Don't allow editing of events
            handleWindowResize: true,
            weekends: false, // will hide Saturdays and Sundays
            slotDuration: "00:30:00", // 15 minute intervals on vertical column
            slotEventOverlap: false, // No overlapping between events
            defaultView: "agendaWeek", // Only show week view
            header: false, // Hide buttons/titles
            minTime: "08:00:00", // Start time
            maxTime: "21:00:01", // End time
            columnHeaderFormat: "ddd", // Only show day of the week names
            displayEventTime: true, // Display event time
            allDaySlot: false,
            Duration: {
                hours: 1
            },
            height: 'auto',
            events: classSchedules,
            slotLabelFormat: [
                'h:mm A' // lower level of text
            ],
            eventRender: function (event, element, view) {
                $(element).css("padding", "5px");
                $(element).css("margin-bottom", "5px");

            },
            eventClick: function (data, event, view) {
                $("#myModal").fadeIn(fadetime);
                $("#colorStrip").css('background-color', data.color);
                currindex = data.index;
                $("#classname").html(`${savedCourses[currindex].coursename} <span style='font-size:small'>(${savedCourses[currindex].unique})</span>`);
                $("#timelines").append(makeLine(savedCourses[currindex].datetimearr));

                var uncapProf = prettifyName(savedCourses[currindex].profname);
                if (uncapProf == "") {
                    uncapProf = "Undecided";
                }
                $("#prof").html(`with <span style='font-weight:bold;'>${uncapProf}</span>`);

                let status = savedCourses[currindex].status;

                let registerlink = savedCourses[currindex].registerlink;
                if (status.includes("closed") || status.includes("cancelled") || !status || !registerlink) {
                    $("#register").text("Can't Register").css("background-color", "#FF5722");
                } else if (status.includes("waitlisted")) {
                    $("#register").text("Join Waitlist").css("background-color", "#FF9800");
                } else {
                    $("#register").text("Register").css("background-color", "#4CAF50");
                }
                var cal = ics();
                for (i in savedCourses) {
                    let course = savedCourses[i];
                    var dtmap = makeMap(course.datetimearr);
                    var timearr = Array.from(dtmap.keys());
                    var dayarr = Array.from(dtmap.values());
                    console.log(timearr);
                    console.log(dayarr);
                    for (var i = 0; i < dayarr.length; i++) {
                        var place = findLoc(dayarr[i], timearr[i], course.datetimearr);
                        var building = place.substring(0, place.search(/\d/) - 1);
                        if (building == "") {
                            building = "Undecided Location";
                        }
                        //cal.addEvent(subject, description, location, begin, end, rrule)
                        let rrurle = {
                            freq: "WEEKLY",
                            interval: 1,
                            byday: [""]

                        }
                        //  cal.addEvent(course.coursename, `with${course.profname}`, building, '', '', '');
                        //      output += `<p class='time'><span>${dayarr[i]}</span>: ${timearr[i].split(",")[0]} to ${timearr[i].split(",")[1]}<span style='float:right';><a target='_blank' href='https://maps.utexas.edu/buildings/UTM/${building}'>${place}</a></span></p>`;
                    }

                }
                cal.download();
            }
        });
    });

    // When the user clicks on <span> (x), close the modal
    $(".close").click(() => {
        $("#myModal").fadeOut(fadetime);
    });
    $("#info").click(() => {
        var currLink = savedCourses[currindex].link;
        setTimeout(() => {
            window.open(currLink);
        }, butdelay);
    });
    $("#remove").click(() => {
        setTimeout(() => {
            chrome.runtime.sendMessage({
                command: "courseStorage",
                course: savedCourses[currindex],
                action: "remove"
            }, function (response) {
                $("#myModal").fadeOut(fadetime);
                updateCalendar();
                chrome.tabs.query({}, function (tabs) {
                    for (var i = 0; i < tabs.length; i++) {
                        chrome.tabs.sendMessage(tabs[i].id, {
                            command: "updateCourseList"
                        });
                    }
                });
            });
        }, butdelay);
    });
    $("#register").click(function () {
        let registerlink = savedCourses[currindex].registerlink;
        let status = savedCourses[currindex].status;
        if (!(status.includes("closed") || status.includes("cancelled") || !status || !registerlink)) {
            setTimeout(() => {
                window.open(registerlink);
            }, butdelay);
        }
    });

    /* convert from the dtarr and maek the time lines*/
    function makeLine(datetimearr) {
        $(".time").remove();
        //converted times back
        var output = "";
        var dtmap = makeMap(datetimearr);
        var timearr = Array.from(dtmap.keys());
        var dayarr = Array.from(dtmap.values());
        for (var i = 0; i < dayarr.length; i++) {
            var place = findLoc(dayarr[i], timearr[i], datetimearr);
            var building = place.substring(0, place.search(/\d/) - 1);
            if (building == "") {
                building = "Undecided Location";
            }
            output += `<p class='time'><span>${dayarr[i]}</span>: ${timearr[i].split(",")[0]} to ${timearr[i].split(",")[1]}<span style='float:right';><a target='_blank' href='https://maps.utexas.edu/buildings/UTM/${building}'>${place}</a></span></p>`;
        }
        return output;
    }

    function makeMap(datetimearr) {
        var dtmap = new Map([]);
        for (var i = 0; i < datetimearr.length; i++) {
            //console.log(datetimearr[i][1][0]);
            datetimearr[i][1][0] = moment(datetimearr[i][1][0], ["HH:mm A"]).format("h:mm A");
            datetimearr[i][1][1] = moment(datetimearr[i][1][1], ["HH:mm A"]).format("h:mm A");
        }
        for (var i = 0; i < datetimearr.length; i++) {
            if (dtmap.has(String(datetimearr[i][1]))) {
                dtmap.set(String(datetimearr[i][1]), dtmap.get(String(datetimearr[i][1])) + datetimearr[i][0]);
            } else {
                dtmap.set(String(datetimearr[i][1]), datetimearr[i][0]);
            }
        }
        return dtmap
    }

    /*Close Modal when hit escape*/
    $(document).keydown((e) => {
        if (e.keyCode == 27) {
            $("#myModal").fadeOut(fadetime);
        }
        $("#snackbar").attr("class", "");
    });
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
        var modal = document.getElementById("myModal");
        if (event.target == modal) {
            $("#myModal").fadeOut(fadetime);
        }
    }
    //find the location of a class given its days and timearrs.
    function findLoc(day, timearr, datetimearr) {
        for (let i = 0; i < datetimearr.length; i++) {
            var dtl = datetimearr[i];
            // console.log(dtl[1]);
            //  console.log(timearr);
            if (day.includes(dtl[0])) {
                if (JSON.stringify(timearr) == JSON.stringify(fixDtl1(dtl[1]))) {
                    return dtl[2];
                }
            }
        }
    }

    function fixDtl1(dtl1) {
        let output = "";
        for (let i = 0; i < dtl1.length; i++) {
            output += dtl1[i];
            if (i != dtl1.length - 1) {
                output += ",";
            }
        }
        return output;
    }

    // Iterate through each saved course and add to 'event'
    function setAllEvents(savedCourses) {
        colorCounter = 0;
        classSchedules = [];
        for (let i = 0; i < savedCourses.length; i++) {
            for (let j = 0; j < savedCourses[i].datetimearr.length; j++) {
                let session = savedCourses[i].datetimearr[j]; // One single session for a class
                setEventForSection(session, colorCounter, i);
            }
            colorCounter++;
        }
    }

    //create the event object for every section
    function setEventForSection(session, colorCounter, i) {
        // console.log(moment().startOf('month').format("YYYY-MM-D"));
        // console.log(moment().day(fullday));
        var fullday = days.get(session[0]);
        var classInfo = savedCourses[i];
        var department = classInfo.coursename.substring(0, classInfo.coursename.search(/\d/) - 2);
        var course_nbr = classInfo.coursename.substring(classInfo.coursename.search(/\d/), classInfo.coursename.indexOf(" ", classInfo.coursename.search(/\d/)));
        var uncapProf = prettifyName(classInfo.profname);
        if (uncapProf == "") {
            uncapProf = "Undecided";
        }
        //start from start of the month
        classSchedules.push({
            title: `${department}-${course_nbr} with ${uncapProf}`,
            start: moment().startOf('month').format("YYYY-MM-") +
                moment()
                .day(fullday)
                ._d.toString()
                .split(" ")[2] +
                "T" +
                session[1][0] +
                ":00",
            end: moment().startOf('month').format("YYYY-MM-") +
                moment()
                .day(fullday)
                ._d.toString()
                .split(" ")[2] +
                "T" +
                session[1][1] +
                ":00",
            color: materialColors[colorCounter],
            index: i,
            allday: false
        });
    }
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.command == "updateCourseList" || request.command == "courseAdded") {
                updateCalendar();
            }
        });

    function updateCalendar() {
        chrome.storage.sync.get("savedCourses", function (data) {
            savedCourses = data.savedCourses
            setAllEvents(data.savedCourses);
            // console.log(classSchedules);
            $('#calendar').fullCalendar('removeEventSources');
            $("#calendar").fullCalendar('addEventSource', classSchedules, true);
        });
    }
    /* Format the Professor Name */
    function prettifyName(profname) {
        return profname.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
});