class Timing{}
Timing.fade_time = 100;
Timing.calendar_fade_time = 100;
Timing.button_delay = 75;


class Colors{}
Colors.material_colors = ['#4CAF50', '#CDDC39',
    '#FFC107', '#2196F3', '#F57C00', '#9C27B0', '#FF5722', '#673AB7',
    '#FF5252', '#E91E63', '#009688', '#00BCD4',
    '#4E342E', '#424242', '#9E9E9E'
];
Colors.open = "#4CAF50";
Colors.waitlisted = "#FF9800";
Colors.closed = "#FF5722";
Colors.no_status = "#607D8B";


Colors.open_light = "#C8E6C9";
Colors.waitlisted_light = "#FFE0B2";
Colors.closed_light = "#FFCCBC";
Colors.no_status_light = "#CFD8DC";


Colors.highlight_conflict = "#F44336";
Colors.highlight_default = "#333333";
Colors.highlight_saved = "#4CAF50";

Colors.badge_flash = "#FF5722";
Colors.badge_default = "#bf5700";


class Export{}
Export.png_options = {
   foreignObjectRendering: true,
   logging: true,
   removeContainer: true,
   async: true,
}

class Popup {}
Popup.num_semesters = 2;

class Text{}
Text.emptyText = function(){
    let arr = ["Doesn't Look Like Anything To Me.", "You Can't Fail Classes You're Not In.", "Pro-Tip: Don't Take O-Chem.",
        "No Work Happens On PCL 5th Floor.", "Sophomore But Freshman By Credit.", "Pain is temporary, GPA is forever.",
        "You've Yee'd Your Last Haw.", "lol everything is already waitlisted.", "At Least You're Not At A&M.",
        `It's ${moment().format("h:mm")} and OU Still Sucks.`, 'TeXAs iS BaCK GuYZ', "'Academically Challenged'",
        'Does McCombs teach Parseltongue?', 'Lets make Daddy Fenves proud.', 'Feel bad if you say Wampus.', 'No Cruce Enfrente Del Bus.',
        'Midterm 1 has been Unmuted', 'Omae Wa Mou Shindeiru...', 'Bevo Bucks are the new Bitcoin', 'Subway Robber > Machete Guy'
    ]
    let index = Math.floor(Math.random() * arr.length);

    return arr[index];
}
Text.button_text_default = "<span style='font-size:small'>Import to </span><b>UT Reg +<b>";
Text.waitlist_button_text_default = "<span style='font-size:small'>Import Waitlists to </span><b>UT Reg +<b>";
Text.button_success = "Courses Saved!";

class Waitlist{}
Waitlist.db_push_hook = "https://webhooks.mongodb-realm.com/api/client/v2.0/app/ut-registration-plus-wyzdn/service/CourseSchedule/incoming_webhook/UpdateValues";
// Waitlist.db_push_hook = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/waitlist-info-pnyrh/service/wait_aid/incoming_webhook/pushVal";
Waitlist.db_pull_hook = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/waitlist-info-pnyrh/service/wait_aid/incoming_webhook/getDB";
