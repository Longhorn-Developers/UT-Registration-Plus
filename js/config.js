class Timing {
    static fade_time = 100;
    static calendar_fade_time = 100;
    static button_delay = 75;
}


class Colors {
    static material_colors = ['#4CAF50', '#CDDC39',
        '#FFC107', '#2196F3', '#F57C00', '#9C27B0', '#FF5722', '#673AB7',
        '#FF5252', '#E91E63', '#009688', '#00BCD4',
        '#4E342E', '#424242', '#9E9E9E'
    ];
    static open = "#4CAF50";
    static waitlisted = "#FF9800";
    static closed = "#FF5722";

    static open_light = "#C8E6C9";
    static waitlisted_light = "#FFE0B2";
    static closed_light = "#FFCCBC";

    static highlight_conflict = "#F44336";
    static highlight_default = "#333333";
    static highlight_saved = "#4CAF50";

    static badge_flash = "#FF5722";
    static badge_default = "#bf5700";
}

class Export {
    static png_options = {
        foreignObjectRendering: true,
        logging: true,
        removeContainer: true,
        async: true,
    }
}

class Popup {
    static num_semesters = 2;
}


class Text {
    static emptyText() {
        let arr = ["Doesn't Look Like Anything To Me.", "You Can't Fail Classes You're Not In.", "Pro-Tip: Don't Take O-Chem.",
            "No Work Happens On PCL 5th Floor.", "Sophomore But Freshman By Credit.", "Pain is temporary, GPA is forever.",
            "You've Yee'd Your Last Haw.", "lol everything is already waitlisted.", "At Least You're Not At A&M.",
            `It's ${moment().format("h:mm")} and OU Still Sucks.`, 'TeXAs iS BaCK GuYZ', "'Academically Challenged'",
            'Does McCombs teach Parseltongue?', 'Lets make Daddy Fenves proud.', 'Feel bad if you say Wampus.', 'No Cruce Enfrente Del Bus.',
            'Midterm 1 has been Unmuted', 'Omae Wa Mou Shindeiru...', 'Bevo Bucks are the new Bitcoin'
        ]
        let index = Math.floor(Math.random() * arr.length);

        return arr[index];
    }
}