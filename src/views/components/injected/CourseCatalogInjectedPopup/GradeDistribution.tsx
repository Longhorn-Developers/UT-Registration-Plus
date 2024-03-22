import type { Course } from '@shared/types/Course';
import type { Distribution, LetterGrade } from '@shared/types/Distribution';
import { extendedColors } from '@shared/types/ThemeColors';
import Spinner from '@views/components/common/Spinner/Spinner';
import Text from '@views/components/common/Text/Text';
import {
    NoDataError,
    queryAggregateDistribution,
    querySemesterDistribution,
} from '@views/lib/database/queryDistribution';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';

interface GradeDistributionProps {
    course: Course;
}

const DataStatus = {
    LOADING: 'LOADING',
    FOUND: 'FOUND',
    NOT_FOUND: 'NOT_FOUND',
    ERROR: 'ERROR',
} as const satisfies Record<string, string>;
type DataStatusType = (typeof DataStatus)[keyof typeof DataStatus];

const GRADE_COLORS = {
    A: extendedColors.gradeDistribution.a,
    'A-': extendedColors.gradeDistribution.aminus,
    'B+': extendedColors.gradeDistribution.bplus,
    B: extendedColors.gradeDistribution.b,
    'B-': extendedColors.gradeDistribution.bminus,
    'C+': extendedColors.gradeDistribution.cplus,
    C: extendedColors.gradeDistribution.c,
    'C-': extendedColors.gradeDistribution.cminus,
    'D+': extendedColors.gradeDistribution.dplus,
    D: extendedColors.gradeDistribution.d,
    'D-': extendedColors.gradeDistribution.dminus,
    F: extendedColors.gradeDistribution.f,
} as const satisfies Record<LetterGrade, string>;

/**
 * Renders the grade distribution chart for a specific course.
 *
 * @component
 * @param {GradeDistributionProps} props - The component props.
 * @param {Course} props.course - The course for which to display the grade distribution.
 * @returns {JSX.Element} The grade distribution chart component.
 */
export default function GradeDistribution({ course }: GradeDistributionProps): JSX.Element {
    const [semester, setSemester] = React.useState('Aggregate');
    const [distributions, setDistributions] = React.useState<Record<string, Distribution>>({});
    const [status, setStatus] = React.useState<DataStatusType>(DataStatus.LOADING);
    const ref = React.useRef<HighchartsReact.RefObject>(null);

    // const chartData = React.useMemo(() => {
    //     if (status === DataStatus.FOUND && distributions[semester]) {
    //         return Object.entries(distributions[semester]).map(([grade, count]) => ({
    //             y: count,
    //             color: GRADE_COLORS[grade as LetterGrade],
    //         }));
    //     }
    //     return Array(12).fill(0);
    // }, [distributions, semester, status]);
    // const chartData: unknown[] = [];

    // React.useEffect(() => {
    //     const fetchInitialData = async () => {
    //         try {
    //             const [aggregateDist, semesters] = await queryAggregateDistribution(course);
    //             const initialDistributions: Record<string, Distribution> = { Aggregate: aggregateDist };
    //             const semesterPromises = semesters.map(semester => querySemesterDistribution(course, semester));
    //             const semesterDistributions = await Promise.all(semesterPromises);
    //             semesters.forEach((semester, i) => {
    //                 initialDistributions[`${semester.season} ${semester.year}`] = semesterDistributions[i];
    //             });
    //             setDistributions(initialDistributions);
    //             setStatus(DataStatus.FOUND);
    //         } catch (e) {
    //             console.error(e);
    //             if (e instanceof NoDataError) {
    //                 setStatus(DataStatus.NOT_FOUND);
    //             } else {
    //                 setStatus(DataStatus.ERROR);
    //             }
    //         }
    //     };

    //     fetchInitialData();
    // }, [course]);

    const handleSelectSemester = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemester(event.target.value);
    };

    const chartOptions: Highcharts.Options = {
        title: { text: undefined },
        subtitle: { text: undefined },
        legend: { enabled: false },
        xAxis: {
            labels: {
                y: 20,
                style: {
                    fontSize: '0.6875rem',
                    fontWeight: '500', 
                    letterSpacing: '0',
                    lineHeight: 'normal',
                    fontStyle: 'normal',
                },
            },
            title: {
                text: 'Grades',
                style: {
                    color: '#333F48',
                    fontSize: '0.80rem',
                    fontWeight: '400',
                },
            },
            categories: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
            tickInterval: 1,
            tickWidth: 1.5,
            tickLength: 10,
            tickColor: '#9CADB7',
            crosshair: true,
            lineColor: '#9CADB7',
        },
        yAxis: {
            labels: {
                style: {
                    fontSize: '0.80rem',
                    fontWeight: '400', // Figma is technically 400, but 500 matches more closely to the render
                    color: '#333F48',
                    lineHeight: '100%',
                    fontStyle: 'normal',
                },
            },
            min: 0,
            title: {
                text: 'Students',
                style: {
                    color: '#333F48',
                    fontSize: '0.80rem',
                    fontWeight: '400',
                },
            },
        },
        chart: {
            style: { fontFamily: 'Roboto Flex, Roboto Flex Local', fontWeight: '600' },
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
                // data: chartData,
            },
        ],
    };

    return (
        <div className='pb-[25px] pt-[12px]'>
            {/* TODO (achadaga): again would be nice to have an updated spinner */}
            {status === DataStatus.LOADING && <Spinner />}
            {status === DataStatus.NOT_FOUND && (
                <HighchartsReact
                    ref={ref}
                    highcharts={Highcharts}
                    options={{
                        ...chartOptions,
                        title: {
                            text: `There is currently no grade distribution data for ${course.department} ${course.number}`,
                        },
                        tooltip: { enabled: false },
                    }}
                />
            )}
            {status === DataStatus.ERROR && <Text variant='p'>Error fetching grade distribution data</Text>}
            {status === DataStatus.FOUND && (
                <>
                    <div className='flex flex-wrap content-center items-center self-stretch justify-center gap-3'>
                        <Text variant='small'>{`Grade Distribution for ${course.department} ${course.number}`}</Text>
                        {/* <select
                            className='flex items-center py-1 px-1 gap-1 border border rounded-1 border-solid'
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
                        </select> */}
                    </div>
                    <HighchartsReact ref={ref} highcharts={Highcharts} options={chartOptions} />
                </>
            )}
        </div>
    );
}
