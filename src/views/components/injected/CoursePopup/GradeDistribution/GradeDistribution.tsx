/* eslint-disable no-nested-ternary */
import React, { useEffect, useRef, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import Card from 'src/views/components/common/Card/Card';
import { bMessenger } from 'src/shared/messages';
import { Course } from 'src/shared/types/Course';
import colors from 'src/views/styles/colors.module.scss';
import Spinner from 'src/views/components/common/Spinner/Spinner';
import Text from 'src/views/components/common/Text/Text';
import Icon from 'src/views/components/common/Icon/Icon';
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

/**
 * A chart to fetch and display the grade distribution for a course
 * @returns
 */
export default function GradeDistribution({ course }: Props) {
    const ref = useRef<HighchartsReact.RefObject>(null);
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
    const [status, setStatus] = useState<DataStatus>(DataStatus.LOADING);

    useEffect(() => {
        bMessenger.getDistribution({ course }).then(distribution => {
            if (!distribution) {
                return setStatus(DataStatus.ERROR);
            }
            if (!distribution.length) {
                return setStatus(DataStatus.NOT_FOUND);
            }
            setChartOptions(options => ({
                ...options,
                series: [
                    {
                        type: 'column',
                        name: 'Grades',
                        data: distribution.map((y, i) => ({
                            y,
                            color:
                                i < 3
                                    ? colors.turtle_pond
                                    : i < 5
                                    ? colors.cactus
                                    : i < 7
                                    ? colors.sunshine
                                    : i < 10
                                    ? colors.tangerine
                                    : colors.speedway_brick,
                        })),
                    },
                ],
            }));
            setStatus(DataStatus.FOUND);
            // the highcharts library kinda sucks and doesn't resize the chart when the window resizes,
            // so we have to manually trigger a resize event when the chart is rendered 🙃
            window.dispatchEvent(new Event('resize'));
        });
    }, [course]);

    if (status === DataStatus.FOUND) {
        return (
            <Card className={styles.chartContainer}>
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
