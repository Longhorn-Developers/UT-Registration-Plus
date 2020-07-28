$(function () {
    console.log("NOTIFY");
    $('table').find('tr').each(function () {
        if ($(this).find('td').hasClass("course_header")) {
            course_name = $(this).find('td').text() + "";
            console.log(course_name);
        }
    })
});

function buildBasicCourseInfo(row, course_name) {
	let {
		name,
		department,
		number
	} = seperateCourseNameParts(course_name);
	course = {
		"department": department,
		"number": number,
		"name": name,
		"unique": $(row).find('td[data-th="Unique"]').text(),
		"professor": $(row).find('td[data-th="Instructor"]').text(),
		"status": $(row).find('td[data-th="Status"]').text()
	}
    return course;
}
