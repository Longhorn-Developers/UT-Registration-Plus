const days = new Map([
    ["M", "Monday"],
    ["T", "Tuesday"],
    ["W", "Wednesday"],
    ["TH", "Thursday"],
    ["F", "Friday"]
]);

const semOrder = {
    "Spring": 0,
    "Fall": 1,
    "Summer": 2,
    "Winter": 3
}


function buildQuery(course_data, sem) {
    let query = !sem ? "select * from agg" : "select * from grades";
    query += " where dept like '%" + course_data["department"] + "%'";
    query += " and prof like '%" + course_data["prof_name"].replace(/'/g, "") + "%'";
    query += " and course_nbr like '%" + course_data["number"] + "%'";
    if (sem) {
        query += "and sem like '%" + sem + "%'";
    }
    return query + "order by a1+a2+a3+b1+b2+b3+c1+c2+c3+d1+d2+d3+f desc";
}


function semesterSort(semA, semB) {
    let aName = semA.split(' ')[0];
    let aYear = parseInt(semA.split(' ')[1]);
    let bName = semB.split(' ')[0];
    let bYear = parseInt(semB.split(' ')[1]);
    if (aYear < bYear)
        return -1;
    if (aYear > bYear)
        return 1;
    if (semOrder[aName] < semOrder[bName])
        return -1;
    if (semOrder[aName] > semOrder[bName])
        return 1;
    return 0;
}

function buildChartConfig(data) {
    return {
        chart: {
            type: 'column',
            backgroundColor: ' #fefefe',
            spacingLeft: 10
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        legend: {
            enabled: false
        },
        xAxis: {
            title: {
                text: 'Grades'
            },
            categories: [
                'A',
                'A-',
                'B+',
                'B',
                'B-',
                'C+',
                'C',
                'C-',
                'D+',
                'D',
                'D-',
                'F'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Students'
            }
        },
        credits: {
            enabled: false
        },
        lang: {
            noData: "The professor hasn't taught this class :("
        },
        tooltip: {
            headerFormat: '<span style="font-size:small; font-weight:bold">{point.key}</span><table>',
            pointFormat: '<td style="color:{black};padding:0;font-size:small; font-weight:bold;"><b>{point.y:.0f} Students</b></td>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            bar: {
                pointPadding: 0.2,
                borderWidth: 0
            },
            series: {
                animation: {
                    duration: 700
                }
            }
        },
        series: [{
            name: 'Grades',
            data: [{
                y: data[6],
                color: '#4CAF50'
            }, {
                y: data[7],
                color: '#8BC34A'
            }, {
                y: data[8],
                color: '#CDDC39'
            }, {
                y: data[9],
                color: '#FFEB3B'
            }, {
                y: data[10],
                color: '#FFC107'
            }, {
                y: data[11],
                color: '#FFA000'
            }, {
                y: data[12],
                color: '#F57C00'
            }, {
                y: data[13],
                color: '#FF5722'
            }, {
                y: data[14],
                color: '#FF5252'
            }, {
                y: data[15],
                color: '#E64A19'
            }, {
                y: data[16],
                color: '#F44336'
            }, {
                y: data[17],
                color: '#D32F2F'
            }]
        }]
    }
}