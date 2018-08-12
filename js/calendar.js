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

    // Counter to iterate through material colors to avoid duplicates
    var colorCounter = 0;
    // Each schedule needs to store 'TITLE - START TIME - END TIME - COLOR'
    var classSchedules = [];
    var savedCourses = [];
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
            maxTime: "21:00:00", // End time
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
            eventClick: function (calEvent, jsEvent, view) {
                console.log(calEvent);
                // $(this).css('background-color', 'green');
                alert('Event: ' + savedCourses[0].coursename);
                // change the border color just for fun

            }
        });
    });

    // Iterate through each saved course and add to 'event'
    function setAllEvents(savedCourses) {
        colorCounter = 0;
        classSchedules = [];
        for (let i = 0; i < savedCourses.length; i++) {
            var classInfo = savedCourses[i];
            var department = classInfo.coursename.substring(0, classInfo.coursename.search(/\d/) - 2);
            var course_nbr = classInfo.coursename.substring(classInfo.coursename.search(/\d/), classInfo.coursename.indexOf(" ", classInfo.coursename.search(/\d/)));
            var uncapProf = classInfo.profname;
            uncapProf = uncapProf.charAt(0) + uncapProf.substring(1).toLowerCase();

            for (let j = 0; j < classInfo.datetimearr.length; j++) {
                let session = classInfo.datetimearr[j]; // One single session for a class
                setEventForSection(session, colorCounter, department, course_nbr, uncapProf);
            }
            colorCounter++;
        }
    }

    //create the event object for every section
    function setEventForSection(session, colorCounter, department, course_nbr, uncapProf) {
        var fullday = days.get(session[0]);
        classSchedules.push({
            title: `${department}-${course_nbr} with ${uncapProf}`,
            start: moment().format("YYYY-MM-") +
                moment()
                .day(fullday)
                ._d.toString()
                .split(" ")[2] +
                "T" +
                session[1][0] +
                ":00",
            end: moment().format("YYYY-MM-") +
                moment()
                .day(fullday)
                ._d.toString()
                .split(" ")[2] +
                "T" +
                session[1][1] +
                ":00",
            color: materialColors[colorCounter],
            allday: false
        });
    }
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.command == "updateCourseList" || request.command == "courseAdded") {
                chrome.storage.sync.get("savedCourses", function (data) {
                    savedCourses = data.savedCourses
                    setAllEvents(data.savedCourses);
                    console.log(classSchedules);
                    $('#calendar').fullCalendar('removeEventSources');
                    $("#calendar").fullCalendar('addEventSource', classSchedules, true);
                });
            }
        });
});