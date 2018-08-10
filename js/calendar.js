$(function() {

    const materialColors = 
    ['#FF1744', '#F50057', '#D500F9', '#651FFF',
     '#3D5AFE', '#2979FF', '#00B0FF', '#00E5FF',
      '#1DE9B6', '#00E676', '#76FF03', '#C6FF00',
       '#FFEA00', '#FFC400', '#FF9100', 'FF3D00',
        '#4E342E', '#424242', '#37474F'];


    // console.log(moment().day('Tuesday')._d.toString().split(' '));
    // console.log(moment().format("YYYY-MM-") + moment().day('Tuesday')._d.toString().split(' ')[2]);

    // Counter to iterate through material colors to avoid duplicates
    var colorCounter = 0;

    // Each schedule needs to store 'TITLE - START TIME - END TIME - COLOR'
    var classSchedules = [];

    chrome.storage.sync.get('savedCourses', function (data) {
        var savedCourses = data.savedCourses;

        console.log(savedCourses);

        // Iterate through each saved course and add to 'event'
        for (let i = 0; i < savedCourses.length; i++) {
            var classInfo = savedCourses[i]; // Store all info for a single class

            for (let j = 0; j < classInfo.datetimearr.length; j++) {
                let session = classInfo.datetimearr[j]; // One single session for a class

                if (session[0] == 'M') {
                    classSchedules.push({
                        title: classInfo.coursename,
                        start: moment().format("YYYY-MM-") + moment().day('Monday')._d.toString().split(' ')[2] + 'T' + session[1][0] + ':00',
                        end: moment().format("YYYY-MM-") + moment().day('Monday')._d.toString().split(' ')[2] + 'T' + session[1][1] + ':00',
                        color: materialColors[colorCounter],
                        allday: false
                    });
                }

                if (session[0] == 'T') {
                    classSchedules.push({
                        title: classInfo.coursename,
                        start: moment().format("YYYY-MM-") + moment().day('Tuesday')._d.toString().split(' ')[2] + 'T' + session[1][0] + ':00',
                        end: moment().format("YYYY-MM-") + moment().day('Tuesday')._d.toString().split(' ')[2] + 'T' + session[1][1] + ':00',
                        color: materialColors[colorCounter],
                        allday: false
                    });
                }

                if (session[0] == 'W') {
                    classSchedules.push({
                        title: classInfo.coursename,
                        start: moment().format("YYYY-MM-") + moment().day('Wednesday')._d.toString().split(' ')[2] + 'T' + session[1][0] + ':00',
                        end: moment().format("YYYY-MM-") + moment().day('Wednesday')._d.toString().split(' ')[2] + 'T' + session[1][1] + ':00',
                        color: materialColors[colorCounter],
                        allday: false
                    });
                }

                if (session[0] == 'TH') {
                    classSchedules.push({
                        title: classInfo.coursename,
                        start: moment().format("YYYY-MM-") + moment().day('Thursday')._d.toString().split(' ')[2] + 'T' + session[1][0] + ':00',
                        end: moment().format("YYYY-MM-") + moment().day('Thursday')._d.toString().split(' ')[2] + 'T' + session[1][1] + ':00',
                        color: materialColors[colorCounter],
                        allday: false
                    });
                }

                if (session[0] == 'F') {
                    classSchedules.push({
                        title: classInfo.coursename,
                        start: moment().format("YYYY-MM-") + moment().day('Friday')._d.toString().split(' ')[2] + 'T' + session[1][0] + ':00',
                        end: moment().format("YYYY-MM-") + moment().day('Friday')._d.toString().split(' ')[2] + 'T' + session[1][1] + ':00',
                        color: materialColors[colorCounter],
                        allday: false
                    });
                }

                colorCounter++;
            }
            
        }

        $('#calendar').fullCalendar({
            editable: false, // Don't allow editing of events
            handleWindowResize: true,
            weekends: false, // will hide Saturdays and Sundays
            defaultView: 'agendaWeek', // Only show week view
            header: false, // Hide buttons/titles
            minTime: '08:00:00', // Start time
            maxTime: '21:00:00', // End time
            columnHeaderFormat: 'ddd', // Only show day of the week names
            displayEventTime: true, // Display event time
            allDaySlot: false,
            events: classSchedules
        })

    });
    
});