import Spinner from '@views/components/common/Spinner/Spinner';
import Text from '@views/components/common/Text/Text';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import { Course } from 'src/shared/types/Course';
import { Distribution, LetterGrade } from 'src/shared/types/Distribution';
import { colors } from 'src/shared/util/themeColors';
import {
    NoDataError,
    queryAggregateDistribution,
    querySemesterDistribution,
} from 'src/views/lib/database/queryDistribution';

interface GradeDistributionProps {
    course: Course;
}

enum DataStatus {
    LOADING = 'LOADING',
    FOUND = 'FOUND',
    NOT_FOUND = 'NOT_FOUND',
    ERROR = 'ERROR',
}

const GRADE_COLORS: Record<LetterGrade, string> = {
    A: colors.gradeDistribution.a,
    'A-': colors.gradeDistribution.aminus,
    'B+': colors.gradeDistribution.bplus,
    B: colors.gradeDistribution.b,
    'B-': colors.gradeDistribution.bminus,
    'C+': colors.gradeDistribution.cplus,
    C: colors.gradeDistribution.c,
    'C-': colors.gradeDistribution.cminus,
    'D+': colors.gradeDistribution.dplus,
    D: colors.gradeDistribution.d,
    'D-': colors.gradeDistribution.dminus,
    F: colors.gradeDistribution.f,
};

const GradeDistribution: React.FC<GradeDistributionProps> = ({ course }) => {
    const [semester, setSemester] = React.useState('Aggregate');
    const [distributions, setDistributions] = React.useState<Record<string, Distribution>>({});
    const [status, setStatus] = React.useState(DataStatus.LOADING);
    const ref = React.useRef<HighchartsReact.RefObject>(null);

    const chartData = React.useMemo(() => {
        if (status === DataStatus.FOUND && distributions[semester]) {
            return Object.entries(distributions[semester]).map(([grade, count]) => ({
                y: count,
                color: GRADE_COLORS[grade as LetterGrade],
            }));
        }
        return [];
    }, [distributions, semester, status]);

    React.useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [aggregateDist, semesters] = await queryAggregateDistribution(course);
                const initialDistributions: Record<string, Distribution> = { Aggregate: aggregateDist };
                const semesterPromises = semesters.map(semester => querySemesterDistribution(course, semester));
                const semesterDistributions = await Promise.all(semesterPromises);
                semesters.forEach((semester, i) => {
                    initialDistributions[`${semester.season} ${semester.year}`] = semesterDistributions[i];
                });
                setDistributions(initialDistributions);
                setStatus(DataStatus.FOUND);
            } catch (e) {
                console.error(e);
                if (e instanceof NoDataError) {
                    setStatus(DataStatus.NOT_FOUND);
                } else {
                    setStatus(DataStatus.ERROR);
                }
            }
        };

        fetchInitialData();
    }, [course]);

    const handleSelectSemester = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemester(event.target.value);
    };

    const chartOptions: Highcharts.Options = {
        title: { text: undefined },
        subtitle: { text: undefined },
        legend: { enabled: false },
        xAxis: {
            title: { text: 'Grade' },
            categories: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
            crosshair: true,
        },
        yAxis: {
            min: 0,
            title: { text: 'Number of Students' },
        },
        chart: {
            style: { fontFamily: 'Roboto Flex', fontWeight: '600' },
            spacingBottom: 25,
            spacingTop: 25,
            height: 250,
        },
        credits: { enabled: false },
        accessibility: { enabled: true },
        tooltip: {
            headerFormat: '<span style="font-size:small; font-weight:bold">{point.key}</span><table>',
            pointFormat:
                '<td style="color:{black};padding:0;font-size:small; font-weight:bold;"><b>{point.y:.0f} Students</b></td>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true,
        },
        plotOptions: {
            bar: { pointPadding: 0.2, borderWidth: 0 },
            series: { animation: { duration: 700 } },
        },
        series: [
            {
                type: 'column',
                name: 'Grades',
                data: chartData,
            },
        ],
    };

    return (
        <div className='pb-[25px] pt-[12px]'>
            {status === DataStatus.LOADING && <Spinner />}
            {status === DataStatus.NOT_FOUND && <Text variant='p'>No grade distribution data found</Text>}
            {status === DataStatus.ERROR && <Text variant='p'>Error fetching grade distribution data</Text>}
            {status === DataStatus.FOUND && (
                <>
                    <div className='w-full flex items-center justify-center gap-[12px]'>
                        <Text variant='p'>Grade distribution for {`${course.department} ${course.number}`}</Text>
                        <select
                            className='border border rounded-[4px] border-solid px-[12px] py-[8px]'
                            onChange={handleSelectSemester}
                        >
                            {Object.keys(distributions)
                                .sort((k1, k2) => {
                                    if (k1 === 'Aggregate') {
                                        return -1;
                                    }
                                    if (k2 === 'Aggregate') {
                                        return 1;
                                    }
                                    const [season1, year1] = k1.split(' ');
                                    const [, year2] = k2.split(' ');
                                    if (year1 !== year2) {
                                        return parseInt(year2, 10) - parseInt(year1, 10);
                                    }
                                    return season1 === 'Fall' ? 1 : -1;
                                })
                                .map(semester => (
                                    <option key={semester} value={semester}>
                                        {semester}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <HighchartsReact ref={ref} highcharts={Highcharts} options={chartOptions} />
                </>
            )}
        </div>
    );
};

export default GradeDistribution;
