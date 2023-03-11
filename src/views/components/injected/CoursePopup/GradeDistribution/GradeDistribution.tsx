/* eslint-disable no-nested-ternary */
import React, { useEffect, useRef, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import Card from 'src/views/components/common/Card/Card';
import { Course, Semester } from 'src/shared/types/Course';
import colors from 'src/views/styles/colors.module.scss';
import Spinner from 'src/views/components/common/Spinner/Spinner';
import Text from 'src/views/components/common/Text/Text';
import Icon from 'src/views/components/common/Icon/Icon';
import { Distribution, LetterGrade } from 'src/shared/types/Distribution';
import {
    NoDataError,
    queryAggregateDistribution,
    querySemesterDistribution,
} from 'src/views/lib/database/queryDistribution';
import { bMessenger } from 'src/shared/messages';
import styles from './GradeDistribution.module.scss';

enum DataStatus {
    LOADING = 'LOADING',
    FOUND = 'FOUND',
    NOT_FOUND = 'NOT_FOUND',
    ERROR = 'ERROR',
}

interface Props {
    course: Course;
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

/**
 * A chart to fetch and display the grade distribution for a course
 * @returns
 */
export default function GradeDistribution({ course }: Props) {
    const ref = useRef<HighchartsReact.RefObject>(null);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
    const [distribution, setDistribution] = useState<Distribution | null>(null);
    const [status, setStatus] = useState<DataStatus>(DataStatus.LOADING);

    const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
        title: {
            text: undefined,
        },
        subtitle: {
            text: undefined,
        },
        legend: {
            enabled: false,
        },
        xAxis: {
            title: {
                text: 'Grades',
            },
            categories: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
            crosshair: true,
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Students',
            },
        },
        chart: {
            style: {
                fontFamily: 'Inter',
                fontWeight: '600',
            },
            spacingBottom: 25,
            spacingTop: 25,
            height: 250,
        },
        credits: {
            enabled: false,
        },
        tooltip: {
            headerFormat: '<span style="font-size:small; font-weight:bold">{point.key}</span><table>',
            pointFormat:
                '<td style="color:{black};padding:0;font-size:small; font-weight:bold;"><b>{point.y:.0f} Students</b></td>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true,
        },
        plotOptions: {
            bar: {
                pointPadding: 0.2,
                borderWidth: 0,
            },
            series: {
                animation: {
                    duration: 700,
                },
            },
        },
        series: [
            {
                type: 'column',
                name: 'Grades',
                data: Array.from({ length: 12 }, () => 0),
            },
        ],
    });

    const updateChart = (distribution: Distribution) => {
        setChartOptions(options => ({
            ...options,
            series: [
                {
                    type: 'column',
                    name: 'Grades',
                    data: Object.entries(distribution).map(([grade, count]) => ({
                        y: count,
                        color: GRADE_COLORS[grade as LetterGrade],
                    })),
                },
            ],
        }));
        window.dispatchEvent(new Event('resize'));
    };

    useEffect(() => {
        queryAggregateDistribution(course)
            .then(([distribution, semesters]) => {
                setSemesters(semesters);
                updateChart(distribution);
                setStatus(DataStatus.FOUND);
            })
            .catch(err => {
                if (err instanceof NoDataError) {
                    return setStatus(DataStatus.NOT_FOUND);
                }
                return setStatus(DataStatus.ERROR);
            });
    }, [course]);

    useEffect(() => {
        (async () => {
            let distribution: Distribution;
            if (selectedSemester) {
                distribution = await querySemesterDistribution(course, selectedSemester);
            } else {
                [distribution] = await queryAggregateDistribution(course);
            }
            updateChart(distribution);
            setStatus(DataStatus.FOUND);
        })().catch(err => {
            if (err instanceof NoDataError) {
                return setStatus(DataStatus.NOT_FOUND);
            }
            return setStatus(DataStatus.ERROR);
        });
    }, [selectedSemester, course]);

    const handleSelectSemester = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const index = parseInt(event.target.value, 10);
        if (index === 0) {
            setSelectedSemester(null);
        } else {
            setSelectedSemester(semesters[index - 1]);
        }
    };

    if (status === DataStatus.FOUND) {
        return (
            <Card className={styles.chartContainer}>
                {semesters.length > 0 && (
                    <div className={styles.selectContainer}>
                        <select onChange={handleSelectSemester}>
                            <option value={0}>Aggregate</option>
                            {semesters.map((semester, index) => (
                                <option key={semester.season + semester.year} value={index + 1}>
                                    {semester.season} {semester.year}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <HighchartsReact ref={ref} highcharts={Highcharts} options={chartOptions} />
            </Card>
        );
    }

    return (
        <Card className={styles.textContainer}>
            {status === DataStatus.LOADING && <Spinner />}
            {status === DataStatus.ERROR && (
                <Card className={styles.text}>
                    <Text color='speedway_brick' size='medium' weight='semi_bold'>
                        There was an error fetching the grade distribution data
                    </Text>
                    <Icon color='speedway_brick' size='large' name='sentiment_dissatisfied' />
                </Card>
            )}
            {status === DataStatus.NOT_FOUND && (
                <Card className={styles.text}>
                    <Text color='charcoal' size='medium' weight='semi_bold'>
                        No grade distribution data was found for this course
                    </Text>
                    <Icon color='charcoal' size='x_large' name='search_off' />
                </Card>
            )}
        </Card>
    );
}
