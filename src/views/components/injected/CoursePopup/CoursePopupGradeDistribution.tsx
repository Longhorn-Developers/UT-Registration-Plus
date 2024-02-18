import Spinner from '@views/components/common/Spinner/Spinner';
import Text from '@views/components/common/Text/Text';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import { Course } from 'src/shared/types/Course';
import { Distribution, LetterGrade } from 'src/shared/types/Distribution';
import {
    NoDataError,
    queryAggregateDistribution,
    querySemesterDistribution,
} from 'src/views/lib/database/queryDistribution';
import colors from 'src/views/styles/colors.module.scss';

interface CoursePopupGradeDistributionProps {
    course: Course;
}

enum DataStatus {
    LOADING = 'LOADING',
    FOUND = 'FOUND',
    NOT_FOUND = 'NOT_FOUND',
    ERROR = 'ERROR',
}

const GRADE_COLORS: Record<LetterGrade, string> = {
    A: colors.turtle_pond,
    'A-': colors.turtle_pond,
    'B+': colors.cactus,
    B: colors.cactus,
    'B-': colors.cactus,
    'C+': colors.sunshine,
    C: colors.sunshine,
    'C-': colors.sunshine,
    'D+': colors.tangerine,
    D: colors.tangerine,
    'D-': colors.tangerine,
    F: colors.speedway_brick,
};

interface State {
    semester: string;
    distributions: Record<string, Distribution>;
    status: DataStatus;
    chartData: { y: number; color: string | null }[];
}

type Action =
    | { type: 'SET_SEMESTER'; semester: string }
    | { type: 'SET_DISTRIBUTIONS'; distributions: Record<string, Distribution> }
    | { type: 'SET_STATUS'; status: DataStatus }
    | { type: 'SET_CHART_DATA'; chartData: { y: number; color: string | null }[] };

const initialState: State = {
    semester: 'Aggregate',
    distributions: {},
    status: DataStatus.LOADING,
    chartData: [],
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_SEMESTER':
            return { ...state, semester: action.semester };
        case 'SET_DISTRIBUTIONS':
            return { ...state, distributions: action.distributions };
        case 'SET_STATUS':
            return { ...state, status: action.status };
        case 'SET_CHART_DATA':
            return { ...state, chartData: action.chartData };
        default:
            return state;
    }
}

const CoursePopupGradeDistribution: React.FC<CoursePopupGradeDistributionProps> = ({ course }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const ref = React.useRef<HighchartsReact.RefObject>(null);

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
                dispatch({ type: 'SET_DISTRIBUTIONS', distributions: initialDistributions });
                dispatch({ type: 'SET_STATUS', status: DataStatus.FOUND });
            } catch (e) {
                console.error(e);
                if (e instanceof NoDataError) {
                    dispatch({ type: 'SET_STATUS', status: DataStatus.NOT_FOUND });
                } else {
                    dispatch({ type: 'SET_STATUS', status: DataStatus.ERROR });
                }
            }
        };

        fetchInitialData();
    }, [course]);

    React.useEffect(() => {
        if (state.status === DataStatus.FOUND && state.distributions[state.semester]) {
            const chartData = Object.entries(state.distributions[state.semester]).map(([grade, count]) => ({
                y: count,
                color: GRADE_COLORS[grade as LetterGrade],
            }));
            dispatch({ type: 'SET_CHART_DATA', chartData });
        }
    }, [state.distributions, state.semester, state.status]);

    const handleSelectSemester = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: 'SET_SEMESTER', semester: event.target.value });
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
                data: state.chartData,
            },
        ],
    };

    return (
        <div className='pb-[25px] pt-[12px]'>
            {state.status === DataStatus.LOADING && <Spinner />}
            {state.status === DataStatus.NOT_FOUND && <Text variant='p'>No grade distribution data found</Text>}
            {state.status === DataStatus.ERROR && <Text variant='p'>Error fetching grade distribution data</Text>}
            {state.status === DataStatus.FOUND && (
                <>
                    <div className='w-full flex items-center justify-center gap-[12px]'>
                        <Text variant='p'>Grade distribution for {`${course.department} ${course.number}`}</Text>
                        <select
                            className='border border rounded-[4px] border-solid px-[12px] py-[8px]'
                            onChange={handleSelectSemester}
                        >
                            {Object.keys(state.distributions)
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

export default CoursePopupGradeDistribution;
