$(function () {
    const materialColors = ['#4CAF50', '#CDDC39',
        '#FFC107', '#2196F3', '#F57C00', '#9C27B0', '#FF5722', '#673AB7',
        '#FF5252', '#E91E63', '#009688', '#00BCD4',
        '#4E342E', '#424242', '#9E9E9E'
    ];

    var options = {

        foreignObjectRendering: true,
        logging: true,
        removeContainer: true,
        async: true,
    }

    const days = new Map([
        ["M", "Monday"],
        ["T", "Tuesday"],
        ["W", "Wednesday"],
        ["TH", "Thursday"],
        ["F", "Friday"]
    ]);
    const fadetime = 150;
    const butdelay = 75;
    $("#calendar").after(`<div id="myModal" class="modal">
                                <div class="modal-content">
                                <span class="close">&times;</span>
                                <div class="card">
                                    <div id="colorStrip" style="height:10px;"></div>
                                    <div class="cardcontainer">
                                        <div id='header'>
                                            <div style="display:flex;">
                                                <h2 id="classname">Classname</h2>
                                            </div>
                                            <p id="prof">Prof</p>
                                        </div>
                                        <button id="info" class="matbut" style="font-size:medium; margin-right: auto; margin-left:auto; background: #2196F3;">More Info</button>
                                        <button id="register" class="matbut" style="font-size:medium; margin-right: auto; margin-left:10px; background: #4CAF50;">Register</button>
                                        <button id="remove" class="matbut" style="font-size:medium;margin:10px;background: #FF0000;">Remove</button>
                                    </div>
                                </div>
                            </div>`);
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
                chrome.runtime.sendMessage({
                    command: "getLine",
                    dtarr: savedCourses[currindex].datetimearr,
                }, function (response) {
                    // update the DOM
                    $('#timelines').remove();
                    setTimeout(function () {
                        var arr = response.line;
                        console.log(arr);
                        var output = "";
                        for (let i = 0; i < arr.length; i++) {
                            let line = arr[i];
                            output +=
                                `<p class='time' style='font-size:large;'>
                                    <span style='display:inline-block;'>${line[0]}:</span>
                                    <span style='margin-left:10px;display:inline-block;text-align:center;'>${line[1]} to ${line[2]}</span>
                                    <span style='float:right;display:inline-block;text-align:right;width: 25%;'>
                                        <a target='_blank' style='color:#3c87a3;text-decoration:none;'href='${line[3]}'>${line[4]}</a>
                                    </span>
                                </p>`;
                        }
                        $("#header").after("<div id='timelines'>" + output + "</div");
                    }, 0);

                });

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
    $("#save").click(() => {
        takePicture();
    });
    $("#clear").click(() => {
        /*Clear the list and the storage of courses*/
        chrome.storage.sync.set({
            savedCourses: []
        });
        chrome.tabs.query({}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, {
                    command: "updateCourseList"
                });
            }
        });
        updateCalendar();
        chrome.runtime.sendMessage({
            command: "updateBadge"
        });

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

    $("#export").click(function () {
        var cal = ics();
        var calendarEvents = $('#calendar').fullCalendar('clientEvents');
        for (i in calendarEvents) {
            let event = calendarEvents[i];
            var title = event.title;
            var classname = title.substring(0, title.indexOf('with'));
            var description = title.substring(title.indexOf('with'));
            var time = event.start._d.toUTCString();
            cal.addEvent(classname, description, event.building, event.start._i, event.end._i, {
                rrule: `RRULE:FREQ=WEEKLY;BYDAY=${time.substring(0, time.indexOf(",") - 1).toUpperCase()};INTERVAL=1`
            });
        }
        cal.download("My_Course_Calendar");
    });

    function takePicture() {
        var width = $("#calendar").width();
        var height = $("#calendar").height();
        let cropper = document.createElement('canvas').getContext('2d');
        html2canvas(document.querySelector("#calendar"), options).then(c => {
            cropper.canvas.width = width;
            cropper.canvas.height = height;
            cropper.drawImage(c, 0, 0);
            var a = document.createElement('a');
            a.href = cropper.canvas.toDataURL("image/png");
            a.download = 'mySchedule.png';
            a.click();
        });
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
    // Iterate through each saved course and add to 'event'
    function setAllEvents(savedCourses) {
        colorCounter = 0;
        classSchedules = [];
        var hours = 0;
        for (let i = 0; i < savedCourses.length; i++) {
            var classInfo = savedCourses[i];
            var course_nbr = classInfo.coursename.substring(classInfo.coursename.search(/\d/), classInfo.coursename.indexOf(" ", classInfo.coursename.search(/\d/)));
            hours += parseInt(course_nbr.substring(course_nbr.search(/\d/), course_nbr.search(/\d/) + 1));
            for (let j = 0; j < savedCourses[i].datetimearr.length; j++) {
                let session = savedCourses[i].datetimearr[j]; // One single session for a class
                setEventForSection(session, colorCounter, i);
            }
            colorCounter++;
        }
        $("#hours").text(hours + " Hours");
        $("#num").text(savedCourses.length + " Courses");
    }

    //create the event object for every section
    function setEventForSection(session, colorCounter, i) {
        // console.log(moment().startOf('month').format("YYYY-MM-D"));
        // console.log(moment().day(fullday));
        var fullday = days.get(session[0]);
        var classInfo = savedCourses[i];
        console.log(session);
        var department = classInfo.coursename.substring(0, classInfo.coursename.search(/\d/) - 2);
        var course_nbr = classInfo.coursename.substring(classInfo.coursename.search(/\d/), classInfo.coursename.indexOf(" ", classInfo.coursename.search(/\d/)));
        var uncapProf = prettifyName(classInfo.profname);
        if (uncapProf == "") {
            uncapProf = "Undecided";
        }
        var year = moment().day(fullday)._d.toString().split(" ")[3];
        var monthNum = moment(moment().day(fullday)._d.toString().split(" ")[1], "MMM").format('MM');
        var beg = `${year}-${monthNum}-`;
        classSchedules.push({
            title: `${department}-${course_nbr} with ${uncapProf}`,
            start: beg +
                moment()
                .day(fullday)
                ._d.toString()
                .split(" ")[2] +
                "T" +
                session[1][0] +
                ":00",
            end: beg +
                moment()
                .day(fullday)
                ._d.toString()
                .split(" ")[2] +
                "T" +
                session[1][1] +
                ":00",
            color: materialColors[colorCounter],
            building: session[2],
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