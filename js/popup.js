var courses;

setCourseList();
getSemesters()
getDepartments();

var can_remove = true;

function setCourseList() {
    $("#courseList").empty();
    chrome.storage.sync.get("savedCourses", function (data) {
        updateConflicts();
        courses = data.savedCourses;
        handleEmpty();
        let hours = 0;
        // build and append the course list element
        for (var i = 0; i < courses.length; i++) {
            let { coursename, unique, profname, status, datetimearr } = courses[i];
            profname = capitalizeString(profname);
            let line = buildTimeLines(datetimearr);
            let list_tile_color = getStatusColor(status);
            let list_sub_color = getStatusColor(status, true);
            let { department, number } = separateCourseNameParts(coursename);
            let class_length = parseInt(number.charAt(0));
            let multi_semester_code = number.slice(-1);
            if (["A", "B"].includes(multi_semester_code)) {
                hours += Math.floor(class_length / 2);
            } else if (["X", "Y", "Z"].includes(multi_semester_code)) {
                hours += Math.floor(class_length / 3);
            } else {
                hours += class_length;
            }
            let list_html = Template.Popup.list_item(i, list_tile_color, unique, department, number, profname, list_sub_color, line);
            $("#courseList").append(list_html);
        }
        $("#meta-metric").text(hours);
    });
}

/* convert from the dtarr and maek the time lines*/
function buildTimeLines(datetimearr) {
    let lines = convertDateTimeArrToLine(datetimearr);
    let output = "";
    if (lines.length == 0) {
        output = "<span style='font-size:medium;'>This class has no meeting times.</span>";
    } else {
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            output += Template.Popup.line(line);
        }
    }
    return output;
}

/* Update the conflict messages */
function updateConflicts() {
    chrome.runtime.sendMessage(
        {
            command: "checkConflicts",
        },
        function (response) {
            console.log("updateConflicts -> response", response);
            if (response.isConflict) {
                var between = response.between;
                let conflict_message = "";
                for (var i = 0; i < between.length; i++) {
                    let courseA = between[i][0];
                    let courseB = between[i][1];
                    conflict_message += `CONFLICT: ${formatShortenedCourseName(courseA)} and ${formatShortenedCourseName(courseB)}`;
                    if (i != between.length - 1) conflict_message += "<br>";
                }
                $(Template.Popup.conflict_message(conflict_message)).prependTo("#courseList").hide().fadeIn(200);
            }
        }
    );
}

/* prettify the name for the conflict messages*/
function formatShortenedCourseName(course) {
    let { number, department } = separateCourseNameParts(course.coursename);
    return `${department} ${number} (${course.unique})`;
}

$(document).click(function (event) {
    $target = $(event.target);

    // If we're not clicking on search button or search popup, and popup is visible, hide it
    if (!$target.closest("#search").length && !$target.closest("#search-popup").length && $("#search-popup").is(":visible")) {
        hideSearchPopup();
    }

    // If we're not clicking on import/export button or imp/exp popup, and popup is visible, hide it
    if (!$target.closest("#impexp").length && !$target.closest("#import-export-popup").length && $("#import-export-popup").is(":visible")) {
        hideImportExportPopup();
    }
});

$(document).ready(function(){
    $('input[name=Button]').on('change', function(){
    $('#type1').toggle("hide");
    $('#type2').toggle("hide");
    });
});

$("#clear").click(function () {
    chrome.storage.sync.set({
        savedCourses: [],
    });
    $("#courseList").empty();
    updateAllTabsCourseList();
    showEmpty();
});

$("#RIS").click(function () {
    chrome.tabs.create({
        url: "https://utdirect.utexas.edu/registrar/ris.WBX",
    });
});

$("#calendar").click(function () {
    chrome.tabs.create({
        url: "calendar.html",
    });
});

$("#impexp").click(function () {
    if ($("#impexp>i").text() == "close") {
        hideImportExportPopup();
    } else {
        if ($("#search>i").text() == "close") {
            hideSearchPopup();
        }
        showImportExportPopup();
    }
});

$("#search").click(function () {
    if ($("#search>i").text() == "close") {
        hideSearchPopup();
    } else {
        if ($("#impexp>i").text() == "close") {
            hideImportExportPopup();
        }
        showSearchPopup();
    }
});

$("#import-class").click(function () {
    $("#import_input").click();
    console.log("back to improting");
});

function isImportedValid(imported_courses) {
    return imported_courses && imported_courses.length && (imported_courses.length == 0 || validateCourses(imported_courses));
}

$("#import_input").change(function (e) {
    console.log("hello");
    var files = e.target.files;
    var reader = new FileReader();
    reader.onload = function () {
        try {
            var imported_courses = JSON.parse(this.result);
            if (isImportedValid(imported_courses)) {
                chrome.storage.sync.set({
                    savedCourses: imported_courses,
                });
                updateAllTabsCourseList();
                setCourseList();
                hideImportExportPopup();
                $("#import_input").val("");
            } else {
                Alert("There was an error.");
            }
        } catch (err) {
            console.log(err);
        }
    };
    reader.readAsText(files[0]);
});

function exportCourses(url) {
    var exportlink = document.createElement("a");
    exportlink.setAttribute("href", url);
    exportlink.setAttribute("download", "my_courses.json");
    exportlink.click();
}

function createBlob(export_courses) {
    return new Blob([JSON.stringify(export_courses, null, 4)], {
        type: "octet/stream",
    });
}

$("#export-class").click(function () {
    chrome.storage.sync.get("savedCourses", function (data) {
        let export_courses = data.savedCourses;
        if (export_courses.length > 0) {
            let url = window.URL.createObjectURL(createBlob(export_courses));
            exportCourses(url);
        } else {
            alert("No Saved Courses to Export.");
        }
        hideImportExportPopup();
    });
});

function openSearch(semester, department, level, courseCode) {
    var link = "";
    if (courseCode) {
        link = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${semester}/results/?search_type_main=COURSE&fos_cn=${department}&course_number=${courseCode}`;
    } else {
        link = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${semester}/results/?fos_fl=${department}&level=${level}&search_type_main=FIELD`;
    }
    chrome.tabs.create({ url: link });
}

function openUniqueSearch(sem, unique) {
	var link = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${sem}/${unique}/`;
	window.open(link);
}

$("#search-class").click(() => {
    let semester = $("#semesters").find(":selected").val();
    let department = $("#department").find(":selected").val();
    let level = $("#level").find(":selected").val();
    let courseCode = $("#courseCode").val();
    let uniqueId = $("#class_id_input").val();
    if (!isNaN(uniqueId) && uniqueId > 0) {
        if (uniqueId.length == 5) {
            openUniqueSearch(semester, uniqueId);
            $("#class_id_input").val('');
            return;
        }
        alert("Oops, check your input. Class IDs should have 5 digits!");
    } else {
        openSearch(semester, department, level, courseCode);
    }
});

$("#options_button").click(function () {
    chrome.tabs.create({
        url: "options.html",
    });
});

$("#courseList")
    .on("mouseover", ".copy_button", function () {
        $(this).addClass("shadow");
    })
    .on("mouseleave", ".copy_button", function () {
        $(this).removeClass("shadow");
    });

$("#courseList").on("click", ".copy_button", function (e) {
    e.stopPropagation();
    copyButtonAnimation($(this));
    let unique = $(this).val();
    copyUnique(unique);
});

function copyUnique(unique) {
    var temp = $("<input>");
    $("body").append(temp);
    temp.val(unique).select();
    document.execCommand("copy");
    temp.remove();
}

$("#courseList").on("click", "li", function () {
    let clicked_item = $(this).closest("li");
    let curr_course = courses[$(clicked_item).attr("id")];
    handleMoreInfo(clicked_item, curr_course);
    handleRegister(clicked_item, curr_course);
    handleRemove(clicked_item, curr_course);
    toggleTimeDropdown(clicked_item);
});

function handleRegister(clicked_item, curr_course) {
    let { status, registerlink } = curr_course;
    let register_button = $(clicked_item).find("#register");
    let can_not_register = canNotRegister(status, registerlink);
    let register_text = can_not_register ? "Can't Register" : status.includes("waitlisted") ? "Join Waitlist" : "Register";
    let register_color = can_not_register ? Colors.closed : status.includes("waitlisted") ? Colors.waitlisted : Colors.open;

    if (!status) {
        register_text = "No Status";
        register_color = Colors.no_status;
    }

    $(register_button).text(register_text).css("background-color", register_color);

    if (!can_not_register) {
        $(register_button).click(function () {
            setCurrentTabUrl(registerlink);
        });
    }
}

function handleRemove(clicked_item, curr_course) {
    let list = $(clicked_item).closest("ul");
    $(clicked_item)
        .find("#listRemove")
        .click(function () {
            if (can_remove) {
                can_remove = false;
                $(list)
                    .find("#conflict")
                    .fadeOut(300, function () {
                        $(clicked_item).remove();
                    });
                subtractHours(curr_course);
                chrome.runtime.sendMessage(
                    {
                        command: "courseStorage",
                        course: curr_course,
                        action: "remove",
                    },
                    () => {
                        $(clicked_item).fadeOut(200);
                        if ($(list).children(":visible").length === 1) showEmpty();
                        can_remove = true;
                        updateConflicts();
                        updateAllTabsCourseList();
                    }
                );
            }
        });
}

function subtractHours(curr_course) {
    let curr_total_hours = parseInt($("#meta-metric").text());
    let curr_course_number = separateCourseNameParts(curr_course.coursename).number;
    let class_length = parseInt(curr_course_number.charAt(0));
    let multi_semester_code = curr_course_number.slice(-1);
    if (["A", "B"].includes(multi_semester_code)) {
        $("#meta-metric").text(curr_total_hours - Math.floor(class_length / 2));
    } else if (["X", "Y", "Z"].includes(multi_semester_code)) {
        $("#meta-metric").text(curr_total_hours - Math.floor(class_length / 3));
    } else {
        $("#meta-metric").text(curr_total_hours - class_length);
    }
}

function handleMoreInfo(clicked_item, curr_course) {
    $(clicked_item)
        .find("#listMoreInfo")
        .click(function () {
            openMoreInfoWithOpenModal(curr_course.link);
        });
}

function handleEmpty() {
    if (courses.length != 0) {
        $("#empty").hide();
        $("#courseList").show();
    } else {
        showEmpty();
    }
}

function copyButtonAnimation(copy_button) {
    $(copy_button).find("i").text("check");
    $(copy_button).stop(true, false).removeAttr("style").removeClass("shadow", {
        duration: 200,
    });
    $(copy_button)
        .find("i")
        .delay(400)
        .queue(function (n) {
            $(this).text("content_copy");
            $(this).parent().removeClass("shadow");
            if ($(this).parent().is(":hover")) {
                $(this).parent().addClass("shadow");
            }
            n();
        });
}

function toggleTimeDropdown(clicked_item) {
    let more_info_button = $(clicked_item).find("#moreInfo");
    let arrow = $(clicked_item).find("#arrow");
    if ($(more_info_button).is(":hidden")) {
        $(more_info_button).fadeIn(200);
        $(arrow).css("transform", "rotate(90deg)");
    } else {
        $(more_info_button).fadeOut(200);
        $(arrow).css("transform", "");
    }
}

function showEmpty() {
    $("#courseList").hide();
    $("#empty").fadeIn(200);
    $("#main").html(Text.emptyText());
    $("#meta-metric").text("0");
}

function hideSearchPopup() {
    $("#search>i").text("search");
    $("#searchtype").hide();
    $("#semcon").hide();
    $("#depcon").hide();
    $("#semesters").hide();
    $("#levcon").hide();
    $("#search-popup").addClass("hide");
}

function showSearchPopup() {
    $("#search>i").text("close");
    $("#class_id_input").show();
    $("#semesters").show();
    $("#searchtype").show();
    $("#semcon").show();
    $("#depcon").show();
    $("#levcon").show();
    $("#search-popup").removeClass("hide");
}

function hideImportExportPopup() {
    $("#import-export-popup").addClass("hide");
    $("#impexp>i").text("import_export");
}

function showImportExportPopup() {
    $("#impexp>i").text("close");
    $("#import-export-popup").removeClass("hide");
}

function getSemesters() {
    chrome.runtime.sendMessage(
        {
            command: "currentSemesters",
        },
        function (response) {
            var { sems } = response;

            chrome.storage.local.get("semesterCache", function (data) {
                chrome.storage.local.set({
                    semesterCache: sems
                });
                
                semesters = data.semesterCache;
                
                let semester_names = Object.keys(semesters);
                for (let i = 0; i < semester_names.length; i++) {
                    let name = semester_names[i];
                    $("#semesters").append(`<option value='${semesters[name]}'>${name}</option>`);
                }
            });

        }
    );
}

function getDepartments() {
    chrome.runtime.sendMessage(
        {
            command: "currentDepartments",
        },
        function (response) {
            let { deps } = response;
            
            chrome.storage.local.get("deptCache", function (data) {
                chrome.storage.local.set({
                    deptCache: deps
                });
                
                departments = data.deptCache;
                
                for (let i = 0; i < departments.length; i++) {
                    let abv = departments[i];
                    $("#department").append(`<option value='${abv}'>${abv}</option>`);
                }
            });
        }
    );
}